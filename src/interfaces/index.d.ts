interface Res<T> {
  success: boolean;
  code: number;
  msg: string;
  data?: T
}

interface FileI {
  filename: string;
  originalname: string;
  buffer: Buffer;
  size: number;
}
