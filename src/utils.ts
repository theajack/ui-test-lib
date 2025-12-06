
export function watiNextFrame () {
    return new Promise(resolve => {
        if (requestAnimationFrame)
            requestAnimationFrame(resolve);
        else
            setTimeout(resolve, 16);
    });
}

export function withResolve <T=any> () {
    let resolve: (v?: T)=>void = () => {};
    let reject: (e: any)=>void = () => {};
    const ready = new Promise<T>((r, j) => {
        // @ts-ignore
        resolve = r;
        reject = j;
    });
    return {
        ready,
        resolve,
        reject,
    };
}