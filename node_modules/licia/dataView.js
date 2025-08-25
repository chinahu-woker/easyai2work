exports = {
    getInt8: function(buf, offset) {
        return (buf[offset] << 24) >> 24;
    },
    getInt16: function(buf, offset, le) {
        if (le) {
            return ((buf[offset] | (buf[offset + 1] << 8)) << 16) >> 16;
        } else {
            return (((buf[offset] << 8) | buf[offset + 1]) << 16) >> 16;
        }
    },
    setInt16: function(buf, offset, val, le) {
        if (le) {
            buf[offset] = val;
            buf[offset + 1] = val >> 8;
        } else {
            buf[offset] = val >> 8;
            buf[offset + 1] = val;
        }
    },
    getUint16: function(buf, offset, le) {
        if (le) {
            return buf[offset] | (buf[offset + 1] << 8);
        } else {
            return buf[offset + 1] | (buf[offset] << 8);
        }
    },
    setUint16: function(buf, offset, val, le) {
        if (le) {
            buf[offset] = val;
            buf[offset + 1] = val >> 8;
        } else {
            buf[offset] = val >> 8;
            buf[offset + 1] = val;
        }
    },
    getInt32: function(buf, offset, le) {
        if (le) {
            return (
                buf[offset] |
                (buf[offset + 1] << 8) |
                (buf[offset + 2] << 16) |
                (buf[offset + 3] << 24)
            );
        } else {
            return (
                (buf[offset] << 24) |
                (buf[offset + 1] << 16) |
                (buf[offset + 2] << 8) |
                buf[offset + 3]
            );
        }
    },
    setInt32: function(buf, offset, val, le) {
        if (le) {
            buf[offset] = val;
            buf[offset + 1] = val >> 8;
            buf[offset + 2] = val >> 16;
            buf[offset + 3] = val >> 24;
        } else {
            buf[offset] = val >> 24;
            buf[offset + 1] = val >> 16;
            buf[offset + 2] = val >> 8;
            buf[offset + 3] = val;
        }
    },
    getUint32: function(buf, offset, le) {
        return this.getInt32(buf, offset, le) >>> 0;
    },
    setUint32: function(buf, offset, val, le) {
        this.setInt32(buf, offset, val, le);
    }
};

module.exports = exports;
