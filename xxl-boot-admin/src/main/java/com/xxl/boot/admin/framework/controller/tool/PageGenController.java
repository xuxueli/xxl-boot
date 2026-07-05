package com.xxl.boot.admin.framework.controller.tool;

import com.xxl.sso.core.annotation.XxlSso;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/tool/pagegen")
public class PageGenController {

    @RequestMapping
    @XxlSso
    public String index(Model model) {
        return "/framework/tool/pagegen";
    }

}
