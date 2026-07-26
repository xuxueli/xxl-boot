<#if fields?exists && fields?size gt 0>
    <#list fields as fieldItem >
        <#if fieldItem.javaType == "Date">
            <#assign importDdate = true />
        </#if>
    </#list>
</#if>
package ${codegen.packageName}.model;

import java.io.Serializable;
<#if importDdate?? && importDdate>
import java.util.Date;
</#if>

/**
* ${codegen.functionName} Entity
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
public class ${codegen.businessName} implements Serializable {
    private static final long serialVersionUID = 42L;

<#if fields?exists && fields?size gt 0>
<#list fields as fieldItem >
    /**
    * ${fieldItem.columnComment}
    */
    private ${fieldItem.javaType} ${fieldItem.javaField};

</#list>
</#if>

<#if fields?exists && fields?size gt 0>
<#list fields as fieldItem>
    public ${fieldItem.javaType} get${fieldItem.javaField?cap_first}() {
        return ${fieldItem.javaField};
    }

    public void set${fieldItem.javaField?cap_first}(${fieldItem.javaType} ${fieldItem.javaField}) {
        this.${fieldItem.javaField} = ${fieldItem.javaField};
    }

</#list>
</#if>
}
