package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.config.ResourcesConfig;
import com.xxl.boot.api.framework.util.FileUploadUtils;
import com.xxl.tool.response.Response;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * 文件处理（文件上传）
 */
@RestController
@RequestMapping("/file")
public class FileController {

    /**
     * 通用上传请求（单文件）
     *
     * @param file 上传的文件
     * @return 上传结果，data 包含可访问相对路径 fileName
     */
    @PostMapping("/upload")
    public Response<Map<String, Object>> upload(@RequestParam("file") MultipartFile file) {
        try {
            // 上传并返回可访问相对路径，如 /profile/upload/yyyy/MM/dd/xxx.png
            String fileName = FileUploadUtils.upload(ResourcesConfig.getUploadPath(), file);
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", fileName);
            data.put("url", fileName);
            return Response.ofSuccess(data);
        } catch (Exception e) {
            return Response.ofFail(e.getMessage());
        }
    }

}
