"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HpeApiError = exports.HpeApiError = function (_Error) {
  _inherits(HpeApiError, _Error);

  function HpeApiError(statusCode, message) {
    _classCallCheck(this, HpeApiError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HpeApiError).call(this, message));

    _this.statusCode = statusCode;
    return _this;
  }

  return HpeApiError;
}(Error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9ocGUtYXBpLWVycm9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFhLFcsV0FBQSxXOzs7QUFDWCx1QkFBWSxVQUFaLEVBQXdCLE9BQXhCLEVBQWlDO0FBQUE7O0FBQUEsK0ZBQ3pCLE9BRHlCOztBQUUvQixVQUFLLFVBQUwsR0FBa0IsVUFBbEI7QUFGK0I7QUFHaEM7OztFQUo4QixLIiwiZmlsZSI6ImxpYi9ocGUtYXBpLWVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEhwZUFwaUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihzdGF0dXNDb2RlLCBtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
