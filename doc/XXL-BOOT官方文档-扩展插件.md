
## XXL-BOOT 插件      
XXL-BOOT 插件，基于 XXL-BOOT-ADMIN 建设的开箱即用的扩展插件，可结合实际业务诉求选择性启用。

## 插件明细

| 模块        | 功能         | 描述                   |
|-----------|------------|----------------------|
| AI模块      | Model配置    | Model配置管理，支持多Model类型，包括：基础模型、文本模型、视觉模型...等；支持多模型供应商，包括：Ollama、OpenAI...等。
| AI模块      | Chat对话     | Chat对话管理，支持自定义Prompt、Model参数；支持历史对话消息持久化，保留历史对话记忆；可基于此支持多场景，包括：智能客服、聊天助手...等；
| AI模块      | 知识库        | 知识库管理，支持知识库管理、索引、检索等；支持多知识库类型，包括：Text、Word、PDF、图片...等；
| AI模块      | WorkFlow定义 | WorkFlow定义管理，支持工作流及Agent/模型的编排定义；工作流执行及日志记录，支持分布式工作流执行以及执行日志记录；
| AI模块      | Agent生图    | 文生图、图生图；生图流程设计，支持集成多模型供应商；
| AI模块      | Agent生视频   | 文生视频、图生视频；支持集成多模型供应商；


## 集成应用

### 1、数据库初始化        
执行扩展插件数据库初始化脚本，脚本位置：

```
xxl-boot/xxl-boot-plugin/doc/db/tables_xxl_boot_plugin.sql
```

### 2、项目部署启动
参考 XXL-BOOT 官方文档，部署启动 xxl-boot-admin 即可，注意需要引入如下插件依赖：

```
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-boot-plugin</artifactId>
</dependency>
```

## 详情介绍

### 1、AI模块

- Model配置：Model配置管理，支持多Model类型，包括：基础模型、文本模型、视觉模型...等；支持多模型供应商，包括：Ollama、OpenAI...等。
- Chat对话：Chat对话管理，支持自定义Prompt、Model参数；支持历史对话消息持久化，保留历史对话记忆；可基于此支持多场景，包括：智能客服、聊天助手...等；
- 知识库：知识库管理，支持知识库管理、索引、检索等；支持多知识库类型，包括：Text、Word、PDF、图片...等；
- WorkFlow定义：WorkFlow定义管理，支持工作流及Agent/模型的编排定义；工作流执行及日志记录，支持分布式工作流执行以及执行日志记录；
- Agent生图：文生图、图生图；生图流程设计，支持集成多模型供应商；
- Agent生视频：文生视频、图生视频；支持集成多模型供应商；