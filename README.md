
# (UI Test Lib)[https://github.com/theajack/ui-test-lib]

[Playground](https://theajack.github.io/jsbox/?github=theajack.ui-test-lib)

一个简单轻量的 UI 自动测试库，用于简化前端 UI 组件的单元测试。

## 特性

- 🚀 简单易用的 API
- 🎯 支持异步测试
- 🔄 支持点击模拟和 DOM 查询
- ⏱️ 支持等待和超时控制
- 📊 详细的测试报告
- 🎨 彩色控制台输出

## 安装

```bash
npm install ui-test-lib -D
```

## 快速开始

```typescript
import { createUt } from 'ui-test-lib';


document.body.innerHTML = `
    <div id="result">Hello</div>
    <button id="btn">Click me</button>
`;
document.getElementById('btn').addEventListener('click', () => {
    document.getElementById('result').innerHTML = 'World';
});

// 创建测试实例
const ut = createUt();
ut.test(
    ut.expect('#result', 'Hello'),
    ut.click('#btn'),
    ut.expect('#result', 'World')
);
```

也可以使用默认的全局实例

```typescript
import { ut } from 'ui-test-lib';

ut.test(

)
```

## API 文档

### createUt<T>()

如果在typescript中使用，可以创建一个测试实例，这样可以支持泛型定义上下文类型。

```typescript
interface MyContext {
  count: number;
  title: string;
}

const ut = createUt<MyContext>();
```

### ut.setUp(fn)

初始化测试上下文，可以在这里设置测试环境和初始数据。支持异步

```typescript
ut.setUp((ctx) => {
  return { count: 0, title: 'Test'};
})
```

**参数：**
- `fn: (ctx: T) => PromiseMaybe<Partial<T>|void>` - 初始化函数，可以是同步或异步

### ut.expect(select, value)

断言期望值，用于验证测试结果。支持异步

```typescript
// 方式 1: 使用选择器
ut.expect('#result', 'expected text')

// 方式 2: 使用 DOM 元素
ut.expect(document.getElementById('result'), 'expected text')

// 方式 3: 使用函数
ut.expect((ctx) => ctx.count, 10)

// 方式 4: 简化写法（默认选择器为 #result）
ut.expect('expected text')
```

**参数：**
- `select: string|Element|((ctx: T) => any)` - 选择器、DOM 元素或函数
- `value?: string|((ctx: T) => any)` - 期望值，可选

### ut.click(...items)

模拟点击操作，支持批量点击。

```typescript
// 单个点击
ut.click('#btn')

// 批量点击
ut.click('#btn1', '#btn2', document.getElementById('btn3'))
```

**参数：**
- `items: (string|Element)[]` - 选择器或 DOM 元素列表

### ut.run(fn)

执行自定义函数，可以访问上下文。支持异步

```typescript
ut.run((ctx) => {
  ctx.count++;
  console.log('Current count:', ctx.count);
})
```

**参数：**
- `fn: (ctx: T) => PromiseMaybe<void>` - 执行函数

### ut.wait(time?)

等待指定时间或下一帧。

```typescript
// 等待 1 秒
ut.wait(1000)

// 等待下一个动画帧
ut.wait()
```

**参数：**
- `time?: number` - 等待时间（毫秒），默认为 0（等待下一帧）

### ut.true(value)

断言值为 true。支持异步

```typescript
ut.true(true)
ut.true((ctx) => ctx.count > 0)
```

**参数：**
- `value: boolean|((ctx: T) => PromiseMaybe<boolean>)` - 布尔值或返回布尔值的函数

### ut.resolve(fn, timeout?)

处理回调函数场景，支持超时控制。支持异步

```typescript
ut.resolve((resolve, ctx) => {
  document.getElementById('btn').addEventListener('click', () => {
    resolve(true);
  });
}, 1000)
```

**参数：**
- `fn: (resolve: (v: boolean) => void, ctx: T) => void` - 回调函数
- `timeout?: number` - 超时时间（毫秒），默认 50ms

### ut.test(...args)

执行测试流程

```typescript
await ut.test(
  ut.setUp(() => { /* ... */ }),
  ut.expect('#result', 'Hello'),
  ut.click('#btn'),
  ut.expect('#result', 'World')
);
```

**返回值：**
```typescript
{
  success: boolean;      // 是否全部通过
  count: number;         // 总测试数
  successCount: number;  // 成功数
  failItems: Array<{     // 失败项
    index: number;
    expect: any;
    value: any;
  }>;
  elapse: number;        // 耗时（毫秒）
}
```

## 完整示例

```typescript
import { createUt } from 'ui-test-lib';

interface TestContext {
  counter: number;
}

const ut = createUt<TestContext>();

async function runTests() {
  const result = await ut.test(
    // 1. 初始化
    ut.setUp((ctx) => {
      document.body.innerHTML = `
        <button id="btn">Click Me</button>
        <div id="result">0</div>
      `;
      ctx.counter = 0;
      
      document.getElementById('btn')!.addEventListener('click', () => {
        ctx.counter++;
        document.getElementById('result')!.textContent = String(ctx.counter);
      });
    }),
    
    // 2. 验证初始状态
    ut.expect('#result', '0'),
    ut.true((ctx) => ctx.counter === 0),
    
    // 3. 模拟点击
    ut.click('#btn'),
    
    // 4. 等待更新
    ut.wait(),
    
    // 5. 验证结果
    ut.expect('#result', '1'),
    ut.true((ctx) => ctx.counter === 1),
    
    // 6. 自定义操作
    ut.run((ctx) => {
      console.log('Test completed!', ctx);
    })
  );
  
  console.log('Test result:', result);
}

runTests();
```

## 开发

```bash
# 安装依赖
npm i -g pnpm lerna
pnpm i

# 开发模式
pnpm run dev

# 构建
pnpm run build

# 发布
pnpm run publish -- x.x.x
```

## License

MIT
