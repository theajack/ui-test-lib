/*
 * @Author: tackchen
 * @Date: 2025-12-06 23:51:31
 * @Description: Coding something
 */
window.jsboxCode = {
    lib: 'https://cdn.jsdelivr.net/npm/ui-test-lib',
    lang: 'javascript',
    needUI: true,
    code: `const {ut} = window.UiTest;

ut.test(
// 1. 初始化
    ut.setUp((ctx) => {
        document.body.innerHTML = \`
            <button id="btn">Click Me</button>
            <div id="result">0</div>
        \`;
        ctx.counter = 0;
        document.getElementById('btn').addEventListener('click', () => {
            ctx.counter++;
            document.getElementById('result').textContent = String(ctx.counter);
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
).then((result) => {
    console.log('Test result:', result);
});
    `
};