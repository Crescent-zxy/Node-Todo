const fs = jest.genMockFromModule("fs");
const _fs = jest.requireActual("fs");

Object.assign(fs, _fs);

let mocks = {};

fs.setMock = (path, error, data) => {
  mocks[path] = [error, data];
};

fs.readFile = (path, option, callback) => {
  if (callback === undefined) callback = option;
  if (path in mocks) {
    callback(...mocks[path]);
  } else {
    _fs.readFile(path, option, callback);
  }
};

fs.writeFile = (path, data, options, callback) => {
  if (path in mocks) {
    mocks[path][1](path, data, options, callback);
  } else {
    _fs.writeFile(path, data, option, callback);
  }
};

fs.clearMocks = () => {
  mocks = {};
};

module.exports = fs;
