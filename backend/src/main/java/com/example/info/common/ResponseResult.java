package com.example.info.common;

public class ResponseResult<T> {
    private boolean success;
    private int code;
    private String message;
    private T data;

    // 手动实现所有setter方法
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setData(T data) {
        this.data = data;
    }

    // 以下是原有的静态方法，保持不变
    public static <T> ResponseResult<T> success(T data) {
        ResponseResult<T> result = new ResponseResult<>();
        result.setSuccess(true);
        result.setCode(200);
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }

    public static ResponseResult<String> success(String message) {
        ResponseResult<String> result = new ResponseResult<>();
        result.setSuccess(true);
        result.setCode(200);
        result.setMessage(message);
        return result;
    }

    public static <T> ResponseResult<T> error(int code, String message) {
        ResponseResult<T> result = new ResponseResult<>();
        result.setSuccess(false);
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    public static <T> ResponseResult<T> error(String message) {
        return error(500, message);
    }
}
