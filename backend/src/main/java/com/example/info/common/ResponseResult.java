package com.example.info.common;

public class ResponseResult<T> {
    private boolean success;
    private int code;
    private String message;
    private T data;

    // Getter 方法
    public boolean isSuccess() {
        return success;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    // Setter 方法
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

    // 成功響應（帶數據）
    public static <T> ResponseResult<T> success(T data) {
        ResponseResult<T> result = new ResponseResult<>();
        result.setSuccess(true);
        result.setCode(200);
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }

    // 成功響應（帶數據和自定義消息）
    public static <T> ResponseResult<T> success(T data, String message) {
        ResponseResult<T> result = new ResponseResult<>();
        result.setSuccess(true);
        result.setCode(200);
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    // 成功響應（僅消息）
    public static ResponseResult<Void> success(String message) {
        ResponseResult<Void> result = new ResponseResult<>();
        result.setSuccess(true);
        result.setCode(200);
        result.setMessage(message);
        return result;
    }

    // 錯誤響應（帶代碼和消息）
    public static <T> ResponseResult<T> error(int code, String message) {
        ResponseResult<T> result = new ResponseResult<>();
        result.setSuccess(false);
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    // 錯誤響應（帶代碼、消息和數據）
    public static <T> ResponseResult<T> error(int code, String message, T data) {
        ResponseResult<T> result = new ResponseResult<>();
        result.setSuccess(false);
        result.setCode(code);
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    // 錯誤響應（默認 500 錯誤）
    public static <T> ResponseResult<T> error(String message) {
        return error(500, message);
    }
}
