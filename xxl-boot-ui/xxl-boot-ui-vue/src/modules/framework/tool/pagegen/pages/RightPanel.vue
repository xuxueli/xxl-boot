<!--
  RightPanel（右侧属性面板）
  功能：展示选中组件的属性配置（组件属性 / 表单属性），支持编辑
  @author xuxueli 2026-11-22
-->
<template>
  <div class="right-board">
    <!-- 面板页签 -->
    <el-tabs v-model="panelState.currentTab" stretch class="center-tabs">
      <el-tab-pane :label="t('tool.pagegen.fieldProps')" name="field" />
      <el-tab-pane :label="t('tool.pagegen.formProps')" name="form" />
    </el-tabs>

    <!-- 组件属性页签 -->
    <div class="field-box">
      <!-- 组件文档 -->
      <a class="document-link" target="_blank" :href="documentLink" :title="t('tool.pagegen.viewDocument')">
        <el-icon>
          <Link />
        </el-icon>
      </a>

      <!-- 组件属性滚动区域 -->
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="panelState.currentTab === 'field' && showField" size="default" label-width="90px" label-position="top" style="">
          <!-- 组件类型 -->
          <el-form-item v-if="activeData.changeTag" :label="t('tool.pagegen.componentType')">
            <el-select v-model="activeData.tagIcon" :placeholder="t('common.selectPlaceholderText', [t('tool.pagegen.componentType')])" :style="{ width: '100%' }" @change="tagChange">
              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.label" :label="item.label" :value="item.tagIcon">
                  <SvgIcon class="node-icon" :icon-class="item.tagIcon" style="margin-right: 10px" />
                  <span> {{ item.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <!-- 字段名 -->
          <el-form-item v-if="activeData.vModel !== undefined" :label="t('tool.pagegen.fieldName')">
            <el-input v-model="activeData.vModel" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.fieldName')])" />
          </el-form-item>

          <!-- 组件名 -->
          <el-form-item v-if="activeData.componentName !== undefined" :label="t('tool.pagegen.componentName')">
            {{ activeData.componentName }}
          </el-form-item>

          <!-- 标题 -->
          <el-form-item v-if="activeData.label !== undefined" :label="t('tool.pagegen.title')">
            <el-input v-model="activeData.label" :placeholder="t('common.inputPlaceholder', [t('system.message.title')])" />
          </el-form-item>

          <!-- 占位提示 -->
          <el-form-item v-if="activeData.placeholder !== undefined" :label="t('tool.pagegen.placeholder')">
            <el-input v-model="activeData.placeholder" :placeholder="t('tool.pagegen.placeholderInput')" />
          </el-form-item>
          <!-- 开始占位 -->
          <el-form-item v-if="activeData['start-placeholder'] !== undefined" :label="t('tool.pagegen.startPlaceholder')">
            <el-input v-model="activeData['start-placeholder']" :placeholder="t('tool.pagegen.placeholderInput')" />
          </el-form-item>
          <!-- 结束占位 -->
          <el-form-item v-if="activeData['end-placeholder'] !== undefined" :label="t('tool.pagegen.endPlaceholder')">
            <el-input v-model="activeData['end-placeholder']" :placeholder="t('tool.pagegen.placeholderInput')" />
          </el-form-item>

          <!-- 表单栅格 -->
          <el-form-item v-if="activeData.span !== undefined" :label="t('tool.pagegen.formGrid')">
            <el-slider v-model="activeData.span" :max="24" :min="1" :marks="{ 12: '' }" @change="spanChange" />
          </el-form-item>
          <el-form-item v-if="activeData.layout === 'rowFormItem'" :label="t('tool.pagegen.gridGap')">
            <el-input-number v-model="activeData.gutter" :min="0" :placeholder="t('tool.pagegen.gridGap')" />
          </el-form-item>

          <!-- 排列 -->
          <el-form-item v-if="activeData.justify !== undefined" :label="t('tool.pagegen.horizontalLayout')">
            <el-select v-model="activeData.justify" :placeholder="t('common.selectPlaceholderText', [t('tool.pagegen.horizontalLayout')])" :style="{ width: '100%' }">
              <el-option v-for="(item, index) in justifyOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.align !== undefined" :label="t('tool.pagegen.verticalLayout')">
            <el-radio-group v-model="activeData.align">
              <el-radio-button value="top">{{ t('tool.pagegen.top') }}</el-radio-button>
              <el-radio-button value="middle">{{ t('tool.pagegen.middle') }}</el-radio-button>
              <el-radio-button value="bottom">{{ t('tool.pagegen.bottom') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- 标签宽度 -->
          <el-form-item v-if="activeData.labelWidth !== undefined" :label="t('tool.pagegen.labelWidth')">
            <el-input v-model.number="activeData.labelWidth" type="number" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.labelWidth')])" />
          </el-form-item>
          <!-- 组件宽度 -->
          <el-form-item v-if="activeData.style && activeData.style.width !== undefined" :label="t('tool.pagegen.componentWidth')">
            <el-input v-model="activeData.style.width" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.componentWidth')])" clearable />
          </el-form-item>

          <!-- 默认值 -->
          <el-form-item v-if="activeData.vModel !== undefined" :label="t('tool.pagegen.defaultValue')">
            <el-input :value="setDefaultValue(activeData.defaultValue)" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.defaultValue')])" @input="onDefaultValueInput" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-checkbox-group'" :label="t('tool.pagegen.minChecked')">
            <el-input-number
              :value="activeData.min"
              :min="0"
              :placeholder="t('tool.pagegen.minChecked')"
              @input="activeData.min = $event ? $event : undefined"
            />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-checkbox-group'" :label="t('tool.pagegen.maxChecked')">
            <el-input-number
              :value="activeData.max"
              :min="0"
              :placeholder="t('tool.pagegen.maxChecked')"
              @input="activeData.max = $event ? $event : undefined"
            />
          </el-form-item>

          <!-- 前缀 -->
          <el-form-item v-if="activeData.prepend !== undefined" :label="t('tool.pagegen.prepend')">
            <el-input v-model="activeData.prepend" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.prepend')])" />
          </el-form-item>
          <el-form-item v-if="activeData.append !== undefined" :label="t('tool.pagegen.append')">
            <el-input v-model="activeData.append" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.append')])" />
          </el-form-item>

          <!-- 图标 -->
          <el-form-item v-if="activeData['prefix-icon'] !== undefined" :label="t('tool.pagegen.prefixIcon')">
            <el-input v-model="activeData['prefix-icon']" :placeholder="t('common.inputPlaceholder', [t('common.noun.prefixIconName')])">
              <template #append>
                <el-button icon="Pointer" @click="openIconsDialog('prefix-icon')"> {{ t('tool.pagegen.select') }} </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" :label="t('tool.pagegen.suffixIcon')">
            <el-input v-model="activeData['suffix-icon']" :placeholder="t('common.inputPlaceholder', [t('common.noun.suffixIconName')])">
              <template #append>
                <el-button icon="Pointer" @click="openIconsDialog('suffix-icon')"> {{ t('tool.pagegen.select') }} </el-button>
              </template>
            </el-input>
          </el-form-item>

          <!-- 分隔符 -->
          <el-form-item v-if="activeData.tag === 'el-cascader'" :label="t('tool.pagegen.optionSeparator')">
            <el-input v-model="activeData.separator" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.optionSeparator')])" />
          </el-form-item>

          <!-- 行数 -->
          <el-form-item v-if="activeData.autosize !== undefined" :label="t('tool.pagegen.minRows')">
            <el-input-number v-model="activeData.autosize.minRows" :min="1" :placeholder="t('tool.pagegen.minRows')" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" :label="t('tool.pagegen.maxRows')">
            <el-input-number v-model="activeData.autosize.maxRows" :min="1" :placeholder="t('tool.pagegen.maxRows')" />
          </el-form-item>

          <!-- 数值范围 -->
          <el-form-item v-if="activeData.min !== undefined" :label="t('tool.pagegen.minValue')">
            <el-input-number v-model="activeData.min" :placeholder="t('tool.pagegen.minValue')" />
          </el-form-item>
          <el-form-item v-if="activeData.max !== undefined" :label="t('tool.pagegen.maxValue')">
            <el-input-number v-model="activeData.max" :placeholder="t('tool.pagegen.maxValue')" />
          </el-form-item>

          <!-- 步长 -->
          <el-form-item v-if="activeData.step !== undefined" :label="t('tool.pagegen.step')">
            <el-input-number v-model="activeData.step" :placeholder="t('tool.pagegen.stepPlaceholder')" />
          </el-form-item>

          <!-- 精度 -->
          <el-form-item v-if="activeData.tag === 'el-input-number'" :label="t('tool.pagegen.precision')">
            <el-input-number v-model="activeData.precision" :min="0" :placeholder="t('tool.pagegen.precision')" />
          </el-form-item>

          <!-- 按钮位置 -->
          <el-form-item v-if="activeData.tag === 'el-input-number'" :label="t('tool.pagegen.controlsPosition')">
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button value=""> {{ t('tool.pagegen.default') }} </el-radio-button>
              <el-radio-button value="right"> {{ t('tool.pagegen.right') }} </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- 最多输入 -->
          <el-form-item v-if="activeData.maxlength !== undefined" :label="t('tool.pagegen.maxInput')">
            <el-input v-model="activeData.maxlength" :placeholder="t('common.inputPlaceholder', [t('common.noun.charLength')])">
              <template v-slot:append> {{ t('tool.pagegen.characters') }} </template>
            </el-input>
          </el-form-item>

          <!-- 提示 -->
          <el-form-item v-if="activeData['active-text'] !== undefined" :label="t('tool.pagegen.activeText')">
            <el-input v-model="activeData['active-text']" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.activeText')])" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-text'] !== undefined" :label="t('tool.pagegen.inactiveText')">
            <el-input v-model="activeData['inactive-text']" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.inactiveText')])" />
          </el-form-item>

          <el-form-item v-if="activeData['active-value'] !== undefined" :label="t('tool.pagegen.activeValue')">
            <el-input
              :value="setDefaultValue(activeData['active-value'])"
              :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.activeValue')])"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-value'] !== undefined" :label="t('tool.pagegen.inactiveValue')">
            <el-input
              :value="setDefaultValue(activeData['inactive-value'])"
              :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.inactiveValue')])"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item>

          <el-form-item v-if="activeData.type !== undefined && 'el-date-picker' === activeData.tag" :label="t('tool.pagegen.timeType')">
            <el-select v-model="activeData.type" :placeholder="t('common.selectPlaceholderText', [t('tool.pagegen.timeType')])" :style="{ width: '100%' }" @change="dateTypeChange">
              <el-option v-for="(item, index) in dateOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="activeData.name !== undefined" :label="t('tool.pagegen.fileField')">
            <el-input v-model="activeData.name" :placeholder="t('common.inputPlaceholder', [t('common.noun.fileFieldName')])" />
          </el-form-item>

          <el-form-item v-if="activeData.accept !== undefined" :label="t('tool.pagegen.fileType')">
            <el-select v-model="activeData.accept" :placeholder="t('common.selectPlaceholderText', [t('tool.pagegen.fileType')])" :style="{ width: '100%' }" clearable>
              <el-option :label="t('tool.pagegen.fileTypeImage')" value="image/*" />
              <el-option :label="t('tool.pagegen.fileTypeVideo')" value="video/*" />
              <el-option :label="t('tool.pagegen.fileTypeAudio')" value="audio/*" />
              <el-option label="excel" value=".xls,.xlsx" />
              <el-option label="word" value=".doc,.docx" />
              <el-option label="pdf" value=".pdf" />
              <el-option label="txt" value=".txt" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="activeData.fileSize !== undefined" :label="t('tool.pagegen.fileSize')">
            <el-input v-model.number="activeData.fileSize" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.fileSize')])">
              <template v-slot:append>
                <el-select v-model="activeData.sizeUnit" :style="{ width: '66px' }">
                  <el-option label="KB" value="KB" />
                  <el-option label="MB" value="MB" />
                  <el-option label="GB" value="GB" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item v-if="activeData.action !== undefined" :label="t('tool.pagegen.uploadUrl')">
            <el-input v-model="activeData.action" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.uploadUrl')])" clearable />
          </el-form-item>

          <el-form-item v-if="activeData['list-type'] !== undefined" :label="t('tool.pagegen.listType')">
            <el-radio-group v-model="activeData['list-type']" size="small">
              <el-radio-button value="text"> {{ t('tool.pagegen.text') }} </el-radio-button>
              <el-radio-button value="picture"> {{ t('tool.pagegen.picture') }} </el-radio-button>
              <el-radio-button value="picture-card"> {{ t('tool.pagegen.pictureCard') }} </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="activeData.buttonText !== undefined" v-show="'picture-card' !== activeData['list-type']" :label="t('tool.pagegen.buttonText')">
            <el-input v-model="activeData.buttonText" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.buttonText')])" />
          </el-form-item>

          <el-form-item v-if="activeData['range-separator'] !== undefined" :label="t('tool.pagegen.separator')">
            <el-input v-model="activeData['range-separator']" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.separator')])" />
          </el-form-item>

          <el-form-item v-if="activeData['picker-options'] !== undefined" :label="t('tool.pagegen.timePeriod')">
            <el-input v-model="activeData['picker-options'].selectableRange" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.timePeriod')])" />
          </el-form-item>

          <el-form-item v-if="activeData.format !== undefined" :label="t('tool.pagegen.timeFormat')">
            <el-input :value="activeData.format" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.timeFormat')])" @input="setTimeValue($event)" />
          </el-form-item>

          <!-- 选项 -->
          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.tag!) > -1">
            <el-divider>{{ t('tool.pagegen.options') }}</el-divider>
            <draggable :list="activeData.options" :animation="340" group="selectItem" handle=".option-drag" item-key="label">
              <template #item="{ element, index }">
                <div :key="index" class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="el-icon-s-operation" />
                  </div>
                  <el-input v-model="element.label" :placeholder="t('tool.pagegen.optionName')" size="small" />
                  <el-input :placeholder="t('tool.pagegen.optionValue')" size="small" :value="element.value" @input="setOptionValue(element, $event)" />
                  <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
                    <el-icon>
                      <Remove />
                    </el-icon>
                  </div>
                </div>
              </template>
            </draggable>
            <div>
              <el-button icon="CirclePlus" style="margin-left: 8px; margin-top: 10px" text bg type="primary" @click="addSelectItem">
                {{ t('tool.pagegen.addOption') }}
              </el-button>
            </div>
            <el-divider />
          </template>

          <!-- 级联选择器选项 -->
          <template v-if="['el-cascader'].indexOf(activeData.tag!) > -1">
            <el-divider>{{ t('tool.pagegen.options') }}</el-divider>
            <el-form-item :label="t('tool.pagegen.dataType')">
              <el-radio-group v-model="activeData.dataType" size="small">
                <el-radio-button value="dynamic"> {{ t('tool.pagegen.dynamicData') }} </el-radio-button>
                <el-radio-button value="static"> {{ t('tool.pagegen.staticData') }} </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <template v-if="activeData.dataType === 'dynamic'">
              <el-form-item :label="t('tool.pagegen.labelKey')">
                <el-input v-model="activeData.labelKey" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.labelKey')])" />
              </el-form-item>
              <el-form-item :label="t('tool.pagegen.valueKey')">
                <el-input v-model="activeData.valueKey" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.valueKey')])" />
              </el-form-item>
              <el-form-item :label="t('tool.pagegen.childrenKey')">
                <el-input v-model="activeData.childrenKey" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.childrenKey')])" />
              </el-form-item>
            </template>

            <el-tree
              v-if="activeData.dataType === 'static'"
              draggable
              :data="activeData.options"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
            <div v-if="activeData.dataType === 'static'">
              <el-button icon="CirclePlus" style="margin-left: 0; margin-top: 10px" type="primary" text bg @click="addTreeItem">
                {{ t('tool.pagegen.addParent') }}
              </el-button>
            </div>
            <el-divider />
          </template>

          <el-form-item v-if="activeData.optionType !== undefined" :label="t('tool.pagegen.optionStyle')">
            <el-radio-group v-model="activeData.optionType">
              <el-radio-button value="default"> {{ t('tool.pagegen.default') }} </el-radio-button>
              <el-radio-button value="button"> {{ t('tool.pagegen.button') }} </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="activeData['active-color'] !== undefined" :label="t('tool.pagegen.activeColor')">
            <el-color-picker v-model="activeData['active-color']" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-color'] !== undefined" :label="t('tool.pagegen.inactiveColor')">
            <el-color-picker v-model="activeData['inactive-color']" />
          </el-form-item>

          <el-form-item v-if="activeData['allow-half'] !== undefined" :label="t('tool.pagegen.allowHalf')">
            <el-switch v-model="activeData['allow-half']" />
          </el-form-item>

          <el-form-item v-if="activeData['show-text'] !== undefined" :label="t('tool.pagegen.showText')">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </el-form-item>

          <el-form-item v-if="activeData['show-score'] !== undefined" :label="t('tool.pagegen.showScore')">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </el-form-item>

          <el-form-item v-if="activeData['show-stops'] !== undefined" :label="t('tool.pagegen.showStops')">
            <el-switch v-model="activeData['show-stops']" />
          </el-form-item>

          <el-form-item v-if="activeData.range !== undefined" :label="t('tool.pagegen.rangeSelect')">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item>

          <el-form-item v-if="activeData.border !== undefined && activeData.optionType === 'default'" :label="t('tool.pagegen.withBorder')">
            <el-switch v-model="activeData.border" />
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'el-color-picker'" :label="t('tool.pagegen.colorFormat')">
            <el-select
              v-model="activeData['color-format']"
              :placeholder="t('common.selectPlaceholderText', [t('tool.pagegen.colorFormat')])"
              :style="{ width: '100%' }"
              @change="colorFormatChange"
            >
              <el-option v-for="(item, index) in colorFormatOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <!-- 选项尺寸 -->
          <el-form-item
            v-if="
              activeData.size !== undefined &&
              (activeData.optionType === 'button' || activeData.border || activeData.tag === 'el-color-picker')
            "
            :label="t('tool.pagegen.optionSize')"
          >
            <el-radio-group v-model="activeData.size">
              <el-radio-button value="large"> {{ t('tool.pagegen.large') }} </el-radio-button>
              <el-radio-button value="default"> {{ t('tool.pagegen.default') }} </el-radio-button>
              <el-radio-button value="small"> {{ t('tool.pagegen.small') }} </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="activeData['show-word-limit'] !== undefined" :label="t('tool.pagegen.inputCount')">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'el-input-number'" :label="t('tool.pagegen.strictStep')">
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'el-cascader'" :label="t('tool.pagegen.multiple')">
            <el-switch v-model="activeData.props.props.multiple" />
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'el-cascader'" :label="t('tool.pagegen.showAllLevels')">
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-cascader'" :label="t('tool.pagegen.filterable')">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.clearable !== undefined" :label="t('tool.pagegen.clearable')">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>

          <el-form-item v-if="activeData.showTip !== undefined" :label="t('tool.pagegen.showTip')">
            <el-switch v-model="activeData.showTip" />
          </el-form-item>

          <el-form-item v-if="activeData.multiple !== undefined" :label="t('tool.pagegen.multipleFile')">
            <el-switch v-model="activeData.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData['auto-upload'] !== undefined" :label="t('tool.pagegen.autoUpload')">
            <el-switch v-model="activeData['auto-upload']" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" :label="t('tool.pagegen.readonly')">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" :label="t('tool.pagegen.disabled')">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" :label="t('tool.pagegen.searchable')">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-select'" :label="t('tool.pagegen.multiple')">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item>
          <el-form-item v-if="activeData.required !== undefined" :label="t('tool.pagegen.required')">
            <el-switch v-model="activeData.required" />
          </el-form-item>

          <!-- 布局结构树 -->
          <template v-if="activeData.layoutTree">
            <el-divider>{{ t('tool.pagegen.layoutTree') }}</el-divider>
            <el-tree :data="[activeData]" :props="layoutTreeProps" node-key="renderKey" default-expand-all draggable>
              <template #default="{ node, data }">
                <span class="node-label">
                  <SvgIcon class="node-icon" :icon-class="data.tagIcon" style="margin-right: 5px" />
                  {{ node.label }}
                </span>
              </template>
            </el-tree>
          </template>

          <!-- 正则校验 -->
          <template v-if="activeData.layout === 'colFormItem'">
            <el-divider>{{ t('tool.pagegen.regexRule') }}</el-divider>
            <div v-for="(item, index) in activeData.regList" :key="index" class="reg-item">
              <span class="close-btn" @click="activeData.regList.splice(index, 1)">
                <el-icon>
                  <Close />
                </el-icon>
              </span>
              <el-form-item :label="t('tool.pagegen.expression')">
                <el-input v-model="item.pattern" :placeholder="t('common.inputPlaceholder', [t('common.noun.regex')])" />
              </el-form-item>
              <el-form-item :label="t('tool.pagegen.errorTip')" style="margin-bottom: 0">
                <el-input v-model="item.message" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.errorTip')])" />
              </el-form-item>
            </div>
            <div>
              <el-button icon="CirclePlus" style="margin-left: 0; margin-top: 10px" type="primary" text bg @click="addReg">
                {{ t('tool.pagegen.addRule') }}
              </el-button>
            </div>
          </template>
        </el-form>

        <!-- 表单属性 -->
        <el-form v-show="panelState.currentTab === 'form'" label-width="90px" label-position="top">
          <el-form-item :label="t('tool.pagegen.formName')">
            <el-input v-model="formConf.formRef" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.formName')])" />
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.formModel')">
            <el-input v-model="formConf.formModel" :placeholder="t('common.inputPlaceholder', [t('common.noun.dataModel')])" />
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.formRules')">
            <el-input v-model="formConf.formRules" :placeholder="t('common.inputPlaceholder', [t('tool.pagegen.formRules')])" />
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.formSize')">
            <el-radio-group v-model="formConf.size">
              <el-radio-button value="large">{{ t('tool.pagegen.large') }}</el-radio-button>
              <el-radio-button value="default">{{ t('tool.pagegen.default') }}</el-radio-button>
              <el-radio-button value="small">{{ t('tool.pagegen.small') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.labelAlign')">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button value="left">{{ t('tool.pagegen.leftAlign') }}</el-radio-button>
              <el-radio-button value="right">{{ t('tool.pagegen.rightAlign') }}</el-radio-button>
              <el-radio-button value="top">{{ t('tool.pagegen.topAlign') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.labelWidth')">
            <el-input-number v-model="formConf.labelWidth" :placeholder="t('tool.pagegen.labelWidth')" />
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.gridGap')">
            <el-input-number v-model="formConf.gutter" :min="0" :placeholder="t('tool.pagegen.gridGap')" />
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.disableForm')">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.formButtons')">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item :label="t('tool.pagegen.showUnfocusedBorder')">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <!-- 图标选择弹窗 -->
    <IconsDialog v-model="panelState.iconsVisible" :current="activeData[panelState.currentIconModel]" @select="setIcon" />

    <!-- 树节点弹窗 -->
    <TreeNodeDialog v-model="panelState.dialogVisible" @commit="addNode" />
  </div>
</template>

<script setup lang="ts">
import { t } from '@/i18n'
import type { FormConf, FormItemConf } from '@/utils/generator/config'
import draggable from 'vuedraggable'
import { isNumberStr } from '@/utils/common'
import IconsDialog from './IconsDialog.vue'
import TreeNodeDialog from './TreeNodeDialog.vue'
import { getInputComponents, getSelectComponents } from '@/utils/generator/config'
import { computed, inject, ref, resolveComponent } from 'vue'
import type { PropType, Ref } from 'vue'
import type { RenderContentContext, RenderContentFunction } from 'element-plus'
import { SvgIcon } from '@/components'

/** 面板 UI 状态 */
interface PanelState {
  /** 当前页签：field 组件属性 / form 表单属性 */
  currentTab: string
  /** 当前待插入的树节点数组 */
  currentNode: FormItemConf[] | null
  /** 树节点弹窗显隐 */
  dialogVisible: boolean
  /** 图标选择弹窗显隐 */
  iconsVisible: boolean
  /** 当前编辑的图标字段名 */
  currentIconModel: string
}

/** 组件类型分组 */
interface TagGroup {
  /** 分组标题 */
  label: string
  /** 分组下的组件列表 */
  options: FormItemConf[]
}

/** 通用下拉选项 */
interface LabelValueOption {
  /** 展示文案 */
  label: string
  /** 选项值 */
  value: string
}

const idGlobal = inject('idGlobal') as Ref<number>
const dateTimeFormat: Record<string, string> = {
  date: 'YYYY-MM-DD',
  week: t('tool.pagegen.dateWeekFormat'),
  month: 'YYYY-MM',
  year: 'YYYY',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  daterange: 'YYYY-MM-DD',
  monthrange: 'YYYY-MM',
  datetimerange: 'YYYY-MM-DD HH:mm:ss'
}
const props = defineProps({
  showField: Boolean /* 是否展示组件属性面板 */,
  activeData: { type: Object as PropType<FormItemConf>, required: true } /* 当前选中组件数据 */,
  formConf: { type: Object as PropType<FormConf>, required: true } /* 表单全局配置 */
})

/* 面板 UI 状态 */
const panelState = ref<PanelState>({
  currentTab: 'field',
  currentNode: null,
  dialogVisible: false,
  iconsVisible: false,
  currentIconModel: ''
})

/* 面板选项配置（静态） */
const dateTypeOptions: LabelValueOption[] = [
  { label: t('tool.pagegen.dateDay'), value: 'date' },
  { label: t('tool.pagegen.dateWeek'), value: 'week' },
  { label: t('tool.pagegen.dateMonth'), value: 'month' },
  { label: t('tool.pagegen.dateYear'), value: 'year' },
  { label: t('tool.pagegen.dateDateTime'), value: 'datetime' }
]
const dateRangeTypeOptions: LabelValueOption[] = [
  { label: t('tool.pagegen.dateRange'), value: 'daterange' },
  { label: t('tool.pagegen.monthRange'), value: 'monthrange' },
  { label: t('tool.pagegen.dateTimeRange'), value: 'datetimerange' }
]
const colorFormatOptions: LabelValueOption[] = [
  { label: 'hex', value: 'hex' },
  { label: 'rgb', value: 'rgb' },
  { label: 'rgba', value: 'rgba' },
  { label: 'hsv', value: 'hsv' },
  { label: 'hsl', value: 'hsl' }
]
const justifyOptions: LabelValueOption[] = [
  { label: 'start', value: 'start' },
  { label: 'end', value: 'end' },
  { label: 'center', value: 'center' },
  { label: 'space-around', value: 'space-around' },
  { label: 'space-between', value: 'space-between' }
]
const layoutTreeProps = {
  /** 树节点展示文案：优先组件名，否则「标题: 字段名」 */
  label(data: FormItemConf) {
    return data.componentName || `${data.label}: ${data.vModel}`
  }
}

const documentLink = computed(() => props.activeData.document || 'https://element-plus.org/zh-CN/guide/installation')

/* 日期类型选项计算：单日期 / 日期范围 */
const dateOptions = computed<LabelValueOption[]>(() => {
  if (props.activeData.type !== undefined && props.activeData.tag === 'el-date-picker') {
    // 存在开始占位符视为范围选择
    if (props.activeData['start-placeholder'] === undefined) {
      return dateTypeOptions
    }
    return dateRangeTypeOptions
  }
  return []
})

// 组件列表：在 setup 中构建，确保文案按当前语言求值
const inputComponents = getInputComponents()
const selectComponents = getSelectComponents()

/* 组件类型切换选项列表 */
const tagList = ref<TagGroup[]>([
  { label: t('tool.pagegen.inputComponents'), options: inputComponents },
  { label: t('tool.pagegen.selectComponents'), options: selectComponents }
])

/** 组件事件：向父组件通知标签切换 */
const emit = defineEmits<{ 'tag-change': [target: FormItemConf] }>()

/** 添加正则校验规则 */
function addReg() {
  props.activeData.regList.push({ pattern: '', message: '' })
}

/** 添加选项（checkbox / radio / select） */
function addSelectItem() {
  props.activeData.options.push({ label: '', value: '' })
}

/** 添加树节点（cascader）：打开弹窗并记录插入位置 */
function addTreeItem() {
  ++idGlobal.value
  panelState.value.dialogVisible = true
  panelState.value.currentNode = props.activeData.options
}

/** 渲染树节点操作按钮（添加子级 / 删除） */
const renderContent: RenderContentFunction = (h, { node, data }) => {
  const treeNodeData = data as FormItemConf
  return h('div', { class: 'custom-tree-node' }, [
    h('span', node.label),
    h('span', { class: 'node-operation' }, [
      h(resolveComponent('el-link'), {
        type: 'primary',
        icon: resolveComponent('Plus'),
        underline: 'never',
        onClick: () => {
          appendTreeNode(treeNodeData)
        }
      }),
      h(resolveComponent('el-link'), {
        type: 'danger',
        icon: resolveComponent('Delete'),
        underline: 'never',
        style: 'margin-left: 5px;',
        onClick: () => {
          removeTreeNode(node, treeNodeData)
        }
      })
    ])
  ])
}

/**
 * 添加子节点：确保 children 存在后打开弹窗
 *
 * @param data 父节点数据
 */
function appendTreeNode(data: FormItemConf) {
  if (!data.children) {
    data.children = []
  }
  panelState.value.dialogVisible = true
  panelState.value.currentNode = data.children
}

/**
 * 删除树节点：从父级 children 中定位并移除
 *
 * @param node 树节点实例
 * @param data 节点数据
 */
function removeTreeNode(node: RenderContentContext['node'], data: FormItemConf) {
  const parentData = node.parent?.data
  // 根节点没有父级数据，无法定位同级数组
  if (!parentData) return
  const children: FormItemConf[] = Array.isArray(parentData) ? parentData : (parentData.children ?? [])
  const index = children.findIndex((item) => item.id === data.id)
  // 未找到对应节点时不做删除
  if (index > -1) children.splice(index, 1)
}

/** 接收弹窗返回的树节点，追加到当前操作数组 */
function addNode(data: FormItemConf) {
  panelState.value.currentNode?.push(data)
}

/**
 * 设置选项值：数字字符串转数字
 *
 * @param item 选项对象
 * @param val  输入值
 */
function setOptionValue(item: FormItemConf, val: string) {
  item.value = isNumberStr(val) ? +val : val
}

/**
 * 默认值转换为输入框显示格式
 *
 * @param val 默认值
 * @returns 可展示的字符串 / 数字 / 空值
 */
function setDefaultValue(val: unknown): string | number | null {
  if (Array.isArray(val)) {
    return val.join(',')
  }
  if (['string', 'number'].indexOf(typeof val) > -1) {
    return val as string | number
  }
  if (typeof val === 'boolean') {
    return `${val}`
  }
  return val as string | number | null
}

/**
 * 默认值输入处理：数组 / 布尔 / 字符串 / 数字
 *
 * @param str 输入框文本
 */
function onDefaultValueInput(str: string) {
  if (Array.isArray(props.activeData.defaultValue)) {
    // 数组：逗号分隔，逐项还原数字
    props.activeData.defaultValue = str.split(',').map((val) => (isNumberStr(val) ? +val : val))
  } else if (['true', 'false'].indexOf(str) > -1) {
    // 布尔值按 JSON 解析
    props.activeData.defaultValue = JSON.parse(str) as boolean
  } else {
    // 其余按数字或字符串处理
    props.activeData.defaultValue = isNumberStr(str) ? +str : str
  }
}

/**
 * switch 开关值输入处理
 *
 * @param val  输入文本
 * @param name 目标属性名
 */
function onSwitchValueInput(val: string, name: string) {
  if (['true', 'false'].indexOf(val) > -1) {
    props.activeData[name] = JSON.parse(val) as boolean
  } else {
    props.activeData[name] = isNumberStr(val) ? +val : val
  }
}

/**
 * 设置时间格式
 *
 * @param val  显示的格式
 * @param type 日期类型，周类型需修正 value-format
 */
function setTimeValue(val: string, type?: string) {
  const valueFormat = type === 'week' ? dateTimeFormat.date : val
  props.activeData.defaultValue = null
  props.activeData['value-format'] = valueFormat
  props.activeData.format = val
}

/**
 * 栅格跨度变更
 *
 * @param val 滑块值
 */
function spanChange(val: number | number[]) {
  props.formConf.span = val
}

/**
 * 多选切换：重置默认值
 *
 * @param val 是否多选
 */
function multipleChange(val: boolean | string | number) {
  props.activeData.defaultValue = val ? [] : ''
}

/**
 * 日期类型切换：同步 value-format
 *
 * @param val 日期类型
 */
function dateTypeChange(val: string) {
  setTimeValue(dateTimeFormat[val], val)
}

/**
 * 范围选择切换
 *
 * @param val 是否范围选择
 */
function rangeChange(val: boolean | string | number) {
  props.activeData.defaultValue = val ? [props.activeData.min, props.activeData.max] : props.activeData.min
}

/**
 * 评分辅助文字切换：开启时取消显示分数
 *
 * @param val 是否显示辅助文字
 */
function rateTextChange(val: boolean | string | number) {
  if (val) props.activeData['show-score'] = false
}

/**
 * 评分显示分数切换：开启时取消显示辅助文字
 *
 * @param val 是否显示分数
 */
function rateScoreChange(val: boolean | string | number) {
  if (val) props.activeData['show-text'] = false
}

/**
 * 颜色格式切换：重置默认值并刷新渲染 key
 *
 * @param val 颜色格式
 */
function colorFormatChange(val: string | null) {
  props.activeData.defaultValue = null
  props.activeData['show-alpha'] = (val ?? '').indexOf('a') > -1
  props.activeData.renderKey = +new Date()
}

/**
 * 打开图标选择弹窗
 *
 * @param model 图标字段名
 */
function openIconsDialog(model: string) {
  panelState.value.iconsVisible = true
  panelState.value.currentIconModel = model
}

/**
 * 设置选中图标
 *
 * @param val 图标名
 */
function setIcon(val: string) {
  props.activeData[panelState.value.currentIconModel] = val
}

/**
 * 切换组件类型：按图标定位组件配置并通知父组件
 *
 * @param tagIcon 组件图标标识
 */
function tagChange(tagIcon: string) {
  const target = inputComponents.find((item) => item.tagIcon === tagIcon) ?? selectComponents.find((item) => item.tagIcon === tagIcon)
  // 未匹配到组件配置时不做切换，避免向父组件传递空数据
  if (!target) return
  emit('tag-change', target)
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;

  &:deep() {
    .el-tabs__header {
      margin: 0;
    }

    .el-input-group__append .el-button {
      display: inline-flex;
    }
  }

  .field-box {
    position: relative;
    height: calc(100vh - 50px - 40px - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }

  .el-scrollbar {
    height: 100%;

    &:deep() {
      .el-scrollbar__view {
        padding: 30px 20px;
      }
    }
  }
}

.reg-item {
  padding: 12px 6px;
  background: var(--el-border-color-extra-light);
  position: relative;
  border-radius: 4px;

  .close-btn {
    position: absolute;
    right: -6px;
    top: -6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    line-height: 16px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    color: #fff;
    z-index: 1;
    cursor: pointer;
    font-size: 12px;
  }
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .el-input + .el-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }

  :deep() {
    .el-icon-time {
      display: none;
    }
  }
}

.document-link {
  position: absolute;
  display: flex;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 18px;
}

.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
