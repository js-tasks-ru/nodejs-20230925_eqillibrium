const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  lines = [''];

  _transform(chunk, encoding, callback) {
    const current = this.lines[0] + chunk.toString();

    this.lines = current.split(os.EOL);

    while (this.lines.length > 1) {
      this.push(this.lines.shift());
    }

    callback();
  }

  _flush(callback) {
    callback(null, this.lines[0]);
  }
}

module.exports = LineSplitStream;
