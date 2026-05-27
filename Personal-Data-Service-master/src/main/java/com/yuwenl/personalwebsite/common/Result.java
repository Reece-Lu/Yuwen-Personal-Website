package com.yuwenl.personalwebsite.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A generic class for representing API responses in a unified format.
 * This class uses generics to provide type safety and flexibility for the data field.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {  // Using generics

    private String code;
    private String msg;
    private T data;  // Generic data type

    /**
     * Creates a success response with the provided data.
     *
     * @param data the data to be included in the response
     * @param <T>  the type of the data
     * @return a success Result object containing the provided data
     */
    public static <T> Result<T> success(T data) {
        return new Result<T>(Constants.CODE_200, "Success", data);
    }

    /**
     * Creates an error response with a custom error code and message.
     *
     * @param code the error code
     * @param msg  the error message
     * @return an error Result object with the specified code and message
     */
    public static Result<?> error(String code, String msg) {
        return new Result<>(code, msg, null);
    }

    /**
     * Creates a default system error response.
     *
     * @return a default system error Result object
     */
    public static Result<?> error() {
        return new Result<>(Constants.CODE_500, "System Error", null);
    }

    /**
     * Creates a response for the 'Not Found' scenario.
     *
     * @param <T> the type of the data
     * @return a Result object for 'Not Found' response
     */
    public static <T> Result<T> notFound() {
        return new Result<T>(Constants.CODE_404, "Not Found", null);
    }

    /**
     * Creates a response for the 'Forbidden' scenario.
     *
     * @param <T> the type of the data
     * @return a Result object for 'Forbidden' response
     */
    public static <T> Result<T> forbidden() {
        return new Result<T>(Constants.CODE_403, "Forbidden", null);
    }

    /**
     * Creates a response for the 'Bad Request' scenario.
     *
     * @param <T> the type of the data
     * @return a Result object for 'Bad Request' response
     */
    public static <T> Result<T> badRequest() {
        return new Result<T>(Constants.CODE_400, "Bad Request", null);
    }

    /**
     * Creates a response for the 'Unauthorized' scenario.
     *
     * @param <T> the type of the data
     * @return a Result object for 'Unauthorized' response
     */
    public static <T> Result<T> unauthorized() {
        return new Result<T>(Constants.CODE_401, "Unauthorized", null);
    }

    /**
     * Creates a response for the 'Internal Server Error' scenario.
     *
     * @param <T> the type of the data
     * @return a Result object for 'Internal Server Error' response
     */
    public static <T> Result<T> internalServerError() {
        return new Result<T>(Constants.CODE_500, "Internal Server Error", null);
    }

}
