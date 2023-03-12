/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "onboarding";

export interface StartRequest {
}

export interface StartResponse {
  instanceId: string;
}

export interface ExecuteRequest {
  instanceId: string;
}

export interface ExecuteResponse {
  instanceId: string;
  nextStep: string;
}

function createBaseStartRequest(): StartRequest {
  return {};
}

export const StartRequest = {
  encode(_: StartRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): StartRequest {
    return {};
  },

  toJSON(_: StartRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<StartRequest>, I>>(base?: I): StartRequest {
    return StartRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StartRequest>, I>>(_: I): StartRequest {
    const message = createBaseStartRequest();
    return message;
  },
};

function createBaseStartResponse(): StartResponse {
  return { instanceId: "" };
}

export const StartResponse = {
  encode(message: StartResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.instanceId !== "") {
      writer.uint32(10).string(message.instanceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StartResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.instanceId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartResponse {
    return { instanceId: isSet(object.instanceId) ? String(object.instanceId) : "" };
  },

  toJSON(message: StartResponse): unknown {
    const obj: any = {};
    message.instanceId !== undefined && (obj.instanceId = message.instanceId);
    return obj;
  },

  create<I extends Exact<DeepPartial<StartResponse>, I>>(base?: I): StartResponse {
    return StartResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StartResponse>, I>>(object: I): StartResponse {
    const message = createBaseStartResponse();
    message.instanceId = object.instanceId ?? "";
    return message;
  },
};

function createBaseExecuteRequest(): ExecuteRequest {
  return { instanceId: "" };
}

export const ExecuteRequest = {
  encode(message: ExecuteRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.instanceId !== "") {
      writer.uint32(10).string(message.instanceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecuteRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecuteRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.instanceId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExecuteRequest {
    return { instanceId: isSet(object.instanceId) ? String(object.instanceId) : "" };
  },

  toJSON(message: ExecuteRequest): unknown {
    const obj: any = {};
    message.instanceId !== undefined && (obj.instanceId = message.instanceId);
    return obj;
  },

  create<I extends Exact<DeepPartial<ExecuteRequest>, I>>(base?: I): ExecuteRequest {
    return ExecuteRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ExecuteRequest>, I>>(object: I): ExecuteRequest {
    const message = createBaseExecuteRequest();
    message.instanceId = object.instanceId ?? "";
    return message;
  },
};

function createBaseExecuteResponse(): ExecuteResponse {
  return { instanceId: "", nextStep: "" };
}

export const ExecuteResponse = {
  encode(message: ExecuteResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.instanceId !== "") {
      writer.uint32(10).string(message.instanceId);
    }
    if (message.nextStep !== "") {
      writer.uint32(18).string(message.nextStep);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecuteResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecuteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.instanceId = reader.string();
          break;
        case 2:
          message.nextStep = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExecuteResponse {
    return {
      instanceId: isSet(object.instanceId) ? String(object.instanceId) : "",
      nextStep: isSet(object.nextStep) ? String(object.nextStep) : "",
    };
  },

  toJSON(message: ExecuteResponse): unknown {
    const obj: any = {};
    message.instanceId !== undefined && (obj.instanceId = message.instanceId);
    message.nextStep !== undefined && (obj.nextStep = message.nextStep);
    return obj;
  },

  create<I extends Exact<DeepPartial<ExecuteResponse>, I>>(base?: I): ExecuteResponse {
    return ExecuteResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ExecuteResponse>, I>>(object: I): ExecuteResponse {
    const message = createBaseExecuteResponse();
    message.instanceId = object.instanceId ?? "";
    message.nextStep = object.nextStep ?? "";
    return message;
  },
};

export interface OnboardingService {
  Start(request: StartRequest): Promise<StartResponse>;
  Execute(request: ExecuteRequest): Promise<ExecuteResponse>;
}

export class OnboardingServiceClientImpl implements OnboardingService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "onboarding.OnboardingService";
    this.rpc = rpc;
    this.Start = this.Start.bind(this);
    this.Execute = this.Execute.bind(this);
  }
  Start(request: StartRequest): Promise<StartResponse> {
    const data = StartRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Start", data);
    return promise.then((data) => StartResponse.decode(new _m0.Reader(data)));
  }

  Execute(request: ExecuteRequest): Promise<ExecuteResponse> {
    const data = ExecuteRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Execute", data);
    return promise.then((data) => ExecuteResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
