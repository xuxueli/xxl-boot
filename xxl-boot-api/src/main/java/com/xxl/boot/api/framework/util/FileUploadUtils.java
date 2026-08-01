package com.xxl.boot.api.framework.util;

import com.xxl.boot.api.framework.config.ResourcesConfig;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * 文件上传工具类
 */
public class FileUploadUtils {

    /**
     * 默认大小 50M
     */
    public static final long DEFAULT_MAX_SIZE = 20 * 1024 * 1024L;

    /**
     * 默认允许上传的类型
     */
    public static final String[] DEFAULT_ALLOWED_EXTENSION = {
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
     * 文件上传（默认基目录 + 默认允许类型）
     */
    public static String upload(MultipartFile file) throws IOException {
        return upload(ResourcesConfig.getUploadPath(), file, DEFAULT_ALLOWED_EXTENSION);
    }

    /**
     * 文件上传（默认允许类型）
     */
    public static String upload(String baseDir, MultipartFile file) throws IOException {
        return upload(baseDir, file, DEFAULT_ALLOWED_EXTENSION);
    }

    /**
     * 文件上传
     *
     * @param baseDir         上传基目录
     * @param file            上传的文件
     * @param allowedExtension 允许的类型
     * @return 可访问的相对路径，如 /profile/upload/yyyy/MM/dd/xxx.png
     */
    public static String upload(String baseDir, MultipartFile file, String[] allowedExtension) throws IOException {
        // 校验文件大小与类型
        assertAllowed(file, allowedExtension);
        // 生成文件名（日期目录 + 原名 + 随机值 + 后缀）
        String fileName = extractFilename(file);
        // 写入磁盘
        String absPath = getAbsoluteFile(baseDir, fileName).getAbsolutePath();
        file.transferTo(Paths.get(absPath));
        // 返回可访问的相对路径
        return getPathFileName(baseDir, fileName);
    }

    /**
     * 生成文件名：yyyy/MM/dd/{原名}_{8位随机}.{后缀}
     */
    private static String extractFilename(MultipartFile file) {
        String baseName = getBaseName(file.getOriginalFilename());
        String extension = getExtension(file);
        String datePath = new SimpleDateFormat("yyyy/MM/dd").format(new Date());
        String random = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        return datePath + "/" + baseName + "_" + random + "." + extension;
    }

    /**
     * 获取绝对文件，父目录不存在时创建
     */
    private static File getAbsoluteFile(String uploadDir, String fileName) {
        File desc = new File(uploadDir + File.separator + fileName);
        if (!desc.getParentFile().exists()) {
            desc.getParentFile().mkdirs();
        }
        return desc;
    }

    /**
     * 拼接可访问路径：{resourcePrefix}/upload/yyyy/MM/dd/xxx.png
     */
    private static String getPathFileName(String uploadDir, String fileName) {
        int dirLastIndex = ResourcesConfig.getProfile().length() + 1;
        String currentDir = uploadDir.substring(dirLastIndex);
        return ResourcesConfig.getResourcePrefix() + "/" + currentDir + "/" + fileName;
    }

    /**
     * 文件大小、类型校验
     */
    private static void assertAllowed(MultipartFile file, String[] allowedExtension) throws IOException {
        // 大小校验
        if (file.getSize() > DEFAULT_MAX_SIZE) {
            throw new IOException("上传文件大小超出限制（最大 20M）");
        }
        // 类型校验
        String extension = getExtension(file);
        if (allowedExtension != null && !isAllowedExtension(extension, allowedExtension)) {
            throw new IOException("上传文件类型不允许：" + extension);
        }
    }

    /**
     * 判断文件后缀是否允许
     */
    private static boolean isAllowedExtension(String extension, String[] allowedExtension) {
        for (String ext : allowedExtension) {
            if (ext.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取文件后缀（不含点，小写）
     */
    private static String getExtension(MultipartFile file) {
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

    /**
     * 获取文件名主体（去掉后缀）
     */
    private static String getBaseName(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "file";
        }
        int index = fileName.lastIndexOf(".");
        return index > 0 ? fileName.substring(0, index) : fileName;
    }

}
