package com.boot.common.utils.bean;

import java.util.Set;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;

/**
 * bean对象属性验证
 */
public class BeanValidators
{
    public static void validateWithException(Validator validator, Object object, Class<?>... groups)
            throws ConstraintViolationException
    {
        Set<ConstraintViolation<Object>> constraintViolations = validator.validate(object, groups);
        if (!constraintViolations.isEmpty())
        {
            throw new ConstraintViolationException(constraintViolations);
        }
    }
}
