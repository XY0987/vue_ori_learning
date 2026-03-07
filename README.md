# Vue 3 Core Source Code Learning 🎯

[![npm](https://img.shields.io/npm/v/vue.svg)](https://www.npmjs.com/package/vue)
[![build status](https://github.com/vuejs/core/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vuejs/core/actions/workflows/ci.yml)
[![Download](https://img.shields.io/npm/dm/vue)](https://www.npmjs.com/package/vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 📖 这是一个用于学习和调试 Vue 3 源码的项目，基于 [vuejs/core](https://github.com/vuejs/core) 官方仓库

---

## 🌟 项目简介

本项目旨在深入理解 Vue 3 的核心实现原理，通过阅读源码、调试分析、编写笔记等方式，全面掌握现代前端框架的设计思想。

### ✨ 主要内容

- 🔍 **源码学习笔记** - 系统化的 Vue 3 源码解析
- 🛠️ **调试工具** - 可视化工具辅助理解
- 📚 **学习指南** - 完整的学习路径和方法
- 🎯 **实践代码** - 核心功能的简化实现

---

## 📁 项目结构

```
vue3-source-learning/
├── 📂 packages/              # Vue 3 核心源码
│   ├── reactivity/          # 响应式系统
│   ├── runtime-core/        # 运行时核心
│   ├── runtime-dom/         # DOM 运行时
│   ├── compiler-core/       # 编译器核心
│   ├── compiler-dom/        # DOM 编译器
│   ├── compiler-sfc/        # 单文件组件编译器
│   └── shared/              # 共享工具
│
├── 📂 docs/                 # 学习文档 📖
│   ├── learning-guide.md    # 学习指南（核心）
│   ├── project-structure.md # 项目结构详解
│   ├── ssr-logic.md         # SSR 逻辑分析
│   └── images/              # 文档图片资源
│
├── 📂 tools/                # 辅助工具 🛠️
│   └── dependency-visualization.html  # 依赖可视化工具
│
├── 📂 notes/                # 个人笔记 📝
│   └── ideas/               # 想法和实验代码
│
├── 📂 scripts/              # 构建脚本
└── 📄 配置文件...
```

---

## 🚀 快速开始

### 环境准备

```bash
# 克隆项目
git clone <your-repo-url>
cd <dirName>

# 安装依赖 (需要 pnpm)
pnpm install

# 构建开发版本
pnpm build

# 运行测试
pnpm test
```

### 调试技巧

```bash
# 构建单个包（带 source map）
pnpm build reactivity --sourceMap --devOnly

# 构建特定格式
pnpm build runtime-core --formats esm-bundler

# 运行特定包的测试
pnpm test packages/reactivity
```

---

## 📚 学习资源

### 核心文档

| 文档                                      | 描述                        | 难度     |
| ----------------------------------------- | --------------------------- | -------- |
| [学习指南](docs/learning-guide.md)        | 系统化的 Vue 3 源码学习路径 | ⭐⭐⭐   |
| [项目结构详解](docs/project-structure.md) | Vue 3 项目目录和模块说明    | ⭐⭐     |
| [SSR 逻辑分析](docs/ssr-logic.md)         | 服务端渲染原理              | ⭐⭐⭐⭐ |

### 可视化工具

- 📊 [依赖关系可视化](tools/dependency-visualization.html) - 查看包之间的依赖关系

### 推荐学习顺序

1. **入门阶段** (1-2周)

   - 阅读 [项目结构详解](docs/project-structure.md)
   - 了解 Vue 3 整体架构
   - 熟悉 monorepo 组织方式

2. **核心阶段** (3-4周)

   - 学习 [学习指南](docs/learning-guide.md)
   - 深入响应式系统 (reactivity)
   - 理解运行时核心 (runtime-core)

3. **进阶阶段** (5-8周)
   - 编译器系统 (compiler-\*)
   - 服务端渲染 (server-renderer)
   - 实践与贡献

---

## 🎯 核心模块解析

### 响应式系统 (Reactivity)

```javascript
// 核心概念
const state = reactive({ count: 0 })
effect(() => console.log(state.count))
state.count++ // 自动触发更新
```

**关键文件:**

- `packages/reactivity/src/reactive.ts` - 响应式对象
- `packages/reactivity/src/effect.ts` - 副作用系统
- `packages/reactivity/src/ref.ts` - ref 实现

### 运行时核心 (Runtime Core)

```javascript
// 组件渲染流程
createApp(App).mount('#app')

// 虚拟 DOM
const vnode = createVNode('div', { id: 'app' }, 'Hello Vue 3')
```

**关键文件:**

- `packages/runtime-core/src/vnode.ts` - 虚拟节点
- `packages/runtime-core/src/component.ts` - 组件系统
- `packages/runtime-core/src/renderer.ts` - 渲染器

### 编译器 (Compiler)

```javascript
// 模板编译
const template = `<div>{{ msg }}</div>`
const { code } = compile(template)
```

**关键文件:**

- `packages/compiler-core/src/parse.ts` - 模板解析
- `packages/compiler-core/src/transform.ts` - AST 转换
- `packages/compiler-core/src/codegen.ts` - 代码生成

---

## 🔧 开发工具

### 特性标志

在阅读源码时，注意这些编译时常量：

- `__DEV__` - 开发环境标识
- `__TEST__` - 测试环境
- `__COMPAT__` - Vue 2 兼容层
- `__FEATURE_OPTIONS_API__` - Options API 开关

### 调试建议

1. **使用 Vue DevTools** - 观察组件树和响应式数据
2. **源码断点调试** - 在关键函数设置断点
3. **测试用例学习** - 通过测试理解 API 行为
4. **简化实现** - 自己实现核心功能加深理解

---

## 📖 学习资源推荐

### 官方资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Vue 3 RFC](https://github.com/vuejs/rfcs)
- [Vue 3 官方源码](https://github.com/vuejs/core)

### 社区资源

- [Vue.js 设计与实现](https://book.douban.com/subject/35768338/) - 霍春阳
- [mini-vue](https://github.com/cuixiaorui/mini-vue) - Vue 3 最小实现
- [Vue Mastery](https://www.vuemastery.com/) - Vue 3 深度课程

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 学习笔记贡献

如果你在学习过程中有新的见解或发现，欢迎：

1. Fork 本仓库
2. 在 `notes/ideas/` 添加你的想法
3. 提交 Pull Request

---

## 📝 原始项目信息

本项目基于 Vue 3 官方源码 [vuejs/core](https://github.com/vuejs/core) 创建。

### Vue.js 原始信息

Vue.js is an MIT-licensed open source project with its ongoing development made possible entirely by the support of these awesome [backers](https://github.com/vuejs/core/blob/main/BACKERS.md). If you'd like to join them, please consider [sponsoring Vue's development](https://vuejs.org/sponsor/).

<p align="center">
  <a target="_blank" href="https://vuejs.org/sponsor/#current-sponsors">
    <img alt="sponsors" src="https://sponsors.vuejs.org/sponsors.svg?v3">
  </a>
</p>

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！⭐**

Made with ❤️ for learning Vue 3

</div>
