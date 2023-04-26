export interface IShaderUnit {
    vertexShaderSource: string;
    fragmentShaderSource: string;
    getShaderVariables: (gl: WebGLRenderingContext, shaderProgramm: WebGLProgram)=> any;
    initShader: (gl: WebGLRenderingContext, shaderProgramm: WebGLProgram, variables: any)=>void;
}

export interface IShaderVars {
    worldUniMat4?: WebGLUniformLocation, 
    posUniVec4?:WebGLUniformLocation,
    colorUniVec4?: WebGLUniformLocation,
    viewUniMat4?: WebGLUniformLocation,
    positionAttr?: number,
    normalAttr?: number,
    texAttr?: number
}