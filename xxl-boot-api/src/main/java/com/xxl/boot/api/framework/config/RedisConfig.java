package com.xxl.boot.api.framework.config;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * redis config
 *
 * @author xuxueli 2020-01-01
 */
@Configuration
public class RedisConfig extends CachingConfigurerSupport {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);

        // serializer
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        GenericJacksonJsonRedisSerializer jacksonJsonRedisSerializer = GenericJacksonJsonRedisSerializer
                .builder()
                .enableUnsafeDefaultTyping()
                .build();

        // for object
        template.setKeySerializer(stringRedisSerializer);
        template.setValueSerializer(jacksonJsonRedisSerializer);

        // for hash
        template.setHashKeySerializer(stringRedisSerializer);
        template.setHashValueSerializer(jacksonJsonRedisSerializer);

        template.afterPropertiesSet();
        return template;
    }

}