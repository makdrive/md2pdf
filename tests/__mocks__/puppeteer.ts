// Puppeteerのモック
const mockSvgElement = {
  boundingBox: jest.fn().mockResolvedValue({
    x: 0,
    y: 0,
    width: 400,
    height: 300
  })
};

const mockPage = {
  setViewport: jest.fn(),
  setContent: jest.fn(),
  setDefaultTimeout: jest.fn(),
  setDefaultNavigationTimeout: jest.fn(),
  evaluate: jest.fn().mockImplementation((fn, ...args) => {
    if (fn.toString().includes('document.fonts')) {
      return Promise.resolve();
    }
    if (fn.toString().includes('svgElement.outerHTML')) {
      return Promise.resolve('<svg width="400" height="300"><rect width="100%" height="100%" fill="blue"/></svg>');
    }
    return Promise.resolve();
  }),
  waitForSelector: jest.fn().mockResolvedValue(true),
  $: jest.fn().mockResolvedValue(mockSvgElement),
  screenshot: jest.fn().mockResolvedValue(Buffer.from('screenshot')),
  close: jest.fn(),
  pdf: jest.fn().mockResolvedValue(Buffer.from('PDF content')),
};

const mockBrowser = {
  newPage: jest.fn().mockResolvedValue(mockPage),
  pages: jest.fn().mockResolvedValue([mockPage]),
  close: jest.fn(),
  isConnected: jest.fn().mockReturnValue(true),
  process: jest.fn().mockReturnValue({ kill: jest.fn() }),
  on: jest.fn(),
};

export const launch = jest.fn().mockResolvedValue(mockBrowser);

export default {
  launch,
};