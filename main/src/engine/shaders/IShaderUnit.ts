export interface IShaderUnit {
    vertexShaderSource: string;
    fragmentShaderSource: string;
    getShaderVariables: (gl: WebGLRenderingContext, shaderProgramm: WebGLProgram)=> any;
    initShader: (gl: WebGLRenderingContext, shaderProgramm: WebGLProgram, variables: any)=>void;
}