// fs/promisesのモック
export const readFile = jest.fn();
export const writeFile = jest.fn();
export const mkdir = jest.fn();
export const stat = jest.fn();
export const unlink = jest.fn();
export const rmdir = jest.fn();