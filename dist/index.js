"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailer = exports.Emailer = void 0;
const Mailer_1 = require("./Mailer");
Object.defineProperty(exports, "Emailer", { enumerable: true, get: function () { return Mailer_1.Emailer; } });
Object.defineProperty(exports, "emailer", { enumerable: true, get: function () { return Mailer_1.emailer; } });
__exportStar(require("./Types"), exports);
exports.default = Mailer_1.emailer;
//# sourceMappingURL=index.js.map