package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.config.ResourcesConfig;
import com.xxl.tool.core.DateTool;
import com.xxl.tool.id.UUIDTool;
import com.xxl.tool.response.Response;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Date;
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
            // 上传并返回可访问相对路径，如 /profile/yyyy/MM/dd/xxx.png
            String fileName = uploadFile(file);
            Map<String, Object> data = new HashMap<>();
            data.put("fileName", fileName);
            data.put("url", fileName);
            return Response.ofSuccess(data);
        } catch (Exception e) {
            return Response.ofFail(e.getMessage());
        }
    }



    // ---------------------- file tools ----------------------

    /**
     * 默认大小 20M
     */
    private static final long DEFAULT_MAX_SIZE = 20 * 1024 * 1024L;

    /**
     * 默认允许上传的类型
     */
    private static final String[] DEFAULT_ALLOWED_EXTENSION = {
            // 图片
            "bmp", "gif", "jpg", "jpeg", "png",
            // word excel powerpoint
            "doc", "docx", "xls", "xlsx", "ppt", "pptx", "html", "htm", "txt",
            // 压缩文件
            "rar", "zip", "gz", "bz2",
            // 视频格式
            "mp4", "avi", "rmvb",
            // pdf
            "pdf" };

    /**
     * 文件上传：校验、落盘并返回可访问相对路径
     *
     * @param file 上传的文件
     * @return 可访问相对路径，如 /profile/yyyy/MM/dd/xxx.png
     */
    private String uploadFile(MultipartFile file) throws IOException {
        // 校验文件大小与类型
        assertAllowed(file);
        // 生成文件名（日期目录 + 原名 + 随机值 + 后缀）
        String fileName = extractFilename(file);
        // 写入磁盘（上传根目录 + 相对路径）
        String baseDir = ResourcesConfig.getUploadPath();
        File desc = new File(baseDir + File.separator + fileName);
        if (!desc.getParentFile().exists()) {
            desc.getParentFile().mkdirs();
        }
        file.transferTo(Paths.get(desc.getAbsolutePath()));
        // 返回可访问相对路径（访问前缀 + 相对路径）
        return ResourcesConfig.getResourcePrefix() + "/" + fileName;
    }

    /**
     * 文件大小、类型校验
     */
    private void assertAllowed(MultipartFile file) throws IOException {
        // 大小校验
        if (file.getSize() > DEFAULT_MAX_SIZE) {
            throw new IOException("上传文件大小超出限制（最大 20M）");
        }
        // 类型校验
        String extension = getExtension(file);
        if (FileController.DEFAULT_ALLOWED_EXTENSION != null && !isAllowedExtension(extension)) {
            throw new IOException("上传文件类型不允许：" + extension);
        }
    }

    /**
     * 判断文件后缀是否允许
     */
    private boolean isAllowedExtension(String extension) {
        for (String ext : FileController.DEFAULT_ALLOWED_EXTENSION) {
            if (ext.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 生成文件名：yyyy/MM/dd/{UUID}.{后缀}
     */
    private String extractFilename(MultipartFile file) {
        String datePath = DateTool.format(new Date(), "yyyy/MM/dd");
        String random = UUIDTool.getSimpleUUID();
        String extension = getExtension(file);
        return datePath + "/" + random + "." + extension;
    }

    /**
     * 获取文件后缀（不含点）
     */
    private String getExtension(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            return "";
        }
        int index = fileName.lastIndexOf(".");
        if (index < 0 || index == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(index + 1);
    }

}
