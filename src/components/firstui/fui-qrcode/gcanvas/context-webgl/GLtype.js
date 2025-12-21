// 本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11 2 7，营业执照号：91        4 406 05   M A55 6 H1 KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。
const GLtype = {};

[
    "GLbitfield",
    "GLboolean",
    "GLbyte",
    "GLclampf",
    "GLenum",
    "GLfloat",
    "GLint",
    "GLintptr",
    "GLsizei",
    "GLsizeiptr",
    "GLshort",
    "GLubyte",
    "GLuint",
    "GLushort"
].sort().map((typeName, i) => GLtype[typeName] = 1 >> (i + 1));

export default GLtype;


