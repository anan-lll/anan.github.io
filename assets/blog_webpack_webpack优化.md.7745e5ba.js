import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.a4f2a176.js";const h=JSON.parse('{"title":"webpack优化","description":"记录webpack相关知识","frontmatter":{"title":"webpack优化","date":"2020-09-09T00:00:00.000Z","description":"记录webpack相关知识","disabled":true,"readMins":8,"tags":["Webpack"]},"headers":[],"relativePath":"blog/webpack/webpack优化.md","filePath":"blog/webpack/webpack优化.md"}'),p={name:"blog/webpack/webpack优化.md"},e=l(`<h2 id="webpack-构建流程" tabindex="-1">webpack 构建流程 <a class="header-anchor" href="#webpack-构建流程" aria-label="Permalink to &quot;webpack 构建流程&quot;">​</a></h2><ul><li>初始化参数：从配置文件、Shell 命令中读取合并相关参数</li><li>初始化编译：使用上述的参数来实例化一个 Compiler 对象，注册插件并传入实例中</li><li>生成依赖图：从 entry 出发，调用所有配置的 loader 来对模块进行翻译，递归解析所有依赖，使用 AST 引擎生成抽象语法树(AST)</li><li>seal 输出资源：根据入口和模块的依赖关系，组装成一个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这是能修改输出内容的最后机会</li><li>emit 输出完成：确定输出文件路径和文件名，直接写入文件系统</li></ul><h2 id="webpack-优化方案" tabindex="-1">webpack 优化方案 <a class="header-anchor" href="#webpack-优化方案" aria-label="Permalink to &quot;webpack 优化方案&quot;">​</a></h2><h3 id="查看-webpack-性能问题" tabindex="-1">查看 webpack 性能问题 <a class="header-anchor" href="#查看-webpack-性能问题" aria-label="Permalink to &quot;查看 webpack 性能问题&quot;">​</a></h3><ul><li>使用<code>speed-measure-webpack-plugin</code>测量打包速度</li><li>使用<code>webpack-bundle-analyzer</code>进行体积分析</li></ul><h3 id="优化-loader-配置" tabindex="-1">优化 Loader 配置 <a class="header-anchor" href="#优化-loader-配置" aria-label="Permalink to &quot;优化 Loader 配置&quot;">​</a></h3><ul><li>优化搜索时间</li><li>缩小文件搜索范围</li><li>减少不必要的编译工作</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  module: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    rules: [</span></span>
<span class="line"><span style="color:#E1E4E8;">      {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 如果项目源码中只有.js文件，就不要写成/\\jsx?$/，以提升正则表达式的性能</span></span>
<span class="line"><span style="color:#E1E4E8;">        test:</span><span style="color:#DBEDFF;"> </span><span style="color:#9ECBFF;">/</span><span style="color:#85E89D;font-weight:bold;">\\.</span><span style="color:#DBEDFF;">js</span><span style="color:#F97583;">$</span><span style="color:#9ECBFF;">/</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// babel-loader支持缓存转换出的结果，通过cacheDirectory选项开启</span></span>
<span class="line"><span style="color:#E1E4E8;">        use: [</span><span style="color:#9ECBFF;">&#39;babel-loader?cacheDirectory&#39;</span><span style="color:#E1E4E8;">],</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 只对src目录中的文件采用 babel-loader</span></span>
<span class="line"><span style="color:#E1E4E8;">        include: path.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">(__dirname, </span><span style="color:#9ECBFF;">&#39;src&#39;</span><span style="color:#E1E4E8;">),</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 使用resolve.alias把原导入路径映射成一个新的导入路径，减少耗时的递归解析操作</span></span>
<span class="line"><span style="color:#E1E4E8;">        alias: {</span></span>
<span class="line"><span style="color:#E1E4E8;">          react: path.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">(__dirname, </span><span style="color:#9ECBFF;">&#39;./node_modules/react/dist/react.min.js&#39;</span><span style="color:#E1E4E8;">),</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 让 Webpack 忽略对部分没采用模块化的文件的递归解析处理</span></span>
<span class="line"><span style="color:#E1E4E8;">        noParse: </span><span style="color:#9ECBFF;">&#39;/jquery|lodash/&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">    ],</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  module: {</span></span>
<span class="line"><span style="color:#24292E;">    rules: [</span></span>
<span class="line"><span style="color:#24292E;">      {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 如果项目源码中只有.js文件，就不要写成/\\jsx?$/，以提升正则表达式的性能</span></span>
<span class="line"><span style="color:#24292E;">        test:</span><span style="color:#032F62;"> /</span><span style="color:#22863A;font-weight:bold;">\\.</span><span style="color:#032F62;">js</span><span style="color:#D73A49;">$</span><span style="color:#032F62;">/</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// babel-loader支持缓存转换出的结果，通过cacheDirectory选项开启</span></span>
<span class="line"><span style="color:#24292E;">        use: [</span><span style="color:#032F62;">&#39;babel-loader?cacheDirectory&#39;</span><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 只对src目录中的文件采用 babel-loader</span></span>
<span class="line"><span style="color:#24292E;">        include: path.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">(__dirname, </span><span style="color:#032F62;">&#39;src&#39;</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 使用resolve.alias把原导入路径映射成一个新的导入路径，减少耗时的递归解析操作</span></span>
<span class="line"><span style="color:#24292E;">        alias: {</span></span>
<span class="line"><span style="color:#24292E;">          react: path.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">(__dirname, </span><span style="color:#032F62;">&#39;./node_modules/react/dist/react.min.js&#39;</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 让 Webpack 忽略对部分没采用模块化的文件的递归解析处理</span></span>
<span class="line"><span style="color:#24292E;">        noParse: </span><span style="color:#032F62;">&#39;/jquery|lodash/&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">    ],</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><h3 id="dll-plugin-or-externals" tabindex="-1">DLL Plugin Or Externals <a class="header-anchor" href="#dll-plugin-or-externals" aria-label="Permalink to &quot;DLL Plugin Or Externals&quot;">​</a></h3><p>目的是在处理第三方库的时候尽量少的打包</p><ul><li>Externals 的使用方式是直接配置 Externals 选项，当 webpack 打包时，遇到所配置的 Externals，直接跳过</li><li>DllPlugin 和 DllReferencePlugin <ul><li>新建一个 webpack 配置文件，用来构建第三方包</li><li>配置 DllPlugin，传入 context、name 和 path，配置好打包的 output，运行一次打包</li><li>在你的业务代码的配置文件中，配置 DllReferencePlugin，context、name、manifest 等</li></ul></li></ul><h3 id="多进程" tabindex="-1">多进程 <a class="header-anchor" href="#多进程" aria-label="Permalink to &quot;多进程&quot;">​</a></h3><p>一些开销特别大的 loader 可以放进一个单独的线程中，但是会有一些限制，比如无法使用 loader 的 api，而且也拿不到 webpack 的配置项</p><ul><li>thread-loader(推荐使用)</li><li>happypack(不怎么维护了)</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">module</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">exports</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  module: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    rules: [</span></span>
<span class="line"><span style="color:#E1E4E8;">      {</span></span>
<span class="line"><span style="color:#E1E4E8;">        test:</span><span style="color:#DBEDFF;"> </span><span style="color:#9ECBFF;">/</span><span style="color:#85E89D;font-weight:bold;">\\.</span><span style="color:#DBEDFF;">js</span><span style="color:#F97583;">$</span><span style="color:#9ECBFF;">/</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        include: path.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;src&#39;</span><span style="color:#E1E4E8;">),</span></span>
<span class="line"><span style="color:#E1E4E8;">        use: [</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&#39;thread-loader&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;">// your expensive loader (e.g babel-loader)</span></span>
<span class="line"><span style="color:#E1E4E8;">        ],</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">    ],</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">module</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">exports</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  module: {</span></span>
<span class="line"><span style="color:#24292E;">    rules: [</span></span>
<span class="line"><span style="color:#24292E;">      {</span></span>
<span class="line"><span style="color:#24292E;">        test:</span><span style="color:#032F62;"> /</span><span style="color:#22863A;font-weight:bold;">\\.</span><span style="color:#032F62;">js</span><span style="color:#D73A49;">$</span><span style="color:#032F62;">/</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        include: path.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;src&#39;</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        use: [</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&#39;thread-loader&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">// your expensive loader (e.g babel-loader)</span></span>
<span class="line"><span style="color:#24292E;">        ],</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">    ],</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">};</span></span></code></pre></div><h3 id="合理利用缓存" tabindex="-1">合理利用缓存 <a class="header-anchor" href="#合理利用缓存" aria-label="Permalink to &quot;合理利用缓存&quot;">​</a></h3><p>缓存可以解决除第一次打包之外的速度，效果比较明显的就是 hard-source-webpack-plugin</p><h3 id="code-splitting-代码分割" tabindex="-1">Code Splitting(代码分割) <a class="header-anchor" href="#code-splitting-代码分割" aria-label="Permalink to &quot;Code Splitting(代码分割)&quot;">​</a></h3><ul><li>配置多 entry 页面</li><li>使用 SplitChunksPlugin 进行重复数据删除和提取</li><li>使用 Dynamic Import 指定模块拆分，并且可以结合 preload、prefetch 做更多用户体验上的优化</li></ul><h3 id="noparse" tabindex="-1">noParse <a class="header-anchor" href="#noparse" aria-label="Permalink to &quot;noParse&quot;">​</a></h3><p>对于某些没有第三方引用的包，可以使用 module.noParse 来提升构建速度</p><h3 id="ignoreplugin" tabindex="-1">IgnorePlugin <a class="header-anchor" href="#ignoreplugin" aria-label="Permalink to &quot;IgnorePlugin&quot;">​</a></h3><p>比如忽略 moment 的本地化内容</p><ul><li>requestRegExp 匹配(test)资源请求路径的正则表达式。</li><li>contextRegExp （可选）匹配(test)资源上下文（目录）的正则表达式。</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> webpack.</span><span style="color:#B392F0;">IgnorePlugin</span><span style="color:#E1E4E8;">(requestRegExp, [contextRegExp]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 忽略 moment 的本地化内容</span></span>
<span class="line"><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> webpack.</span><span style="color:#B392F0;">IgnorePlugin</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">/</span><span style="color:#F97583;">^</span><span style="color:#85E89D;font-weight:bold;">\\.\\/</span><span style="color:#DBEDFF;">locale</span><span style="color:#F97583;">$</span><span style="color:#9ECBFF;">/</span><span style="color:#E1E4E8;">,</span><span style="color:#DBEDFF;"> </span><span style="color:#9ECBFF;">/</span><span style="color:#DBEDFF;">moment</span><span style="color:#F97583;">$</span><span style="color:#9ECBFF;">/</span><span style="color:#E1E4E8;">);</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">new</span><span style="color:#24292E;"> webpack.</span><span style="color:#6F42C1;">IgnorePlugin</span><span style="color:#24292E;">(requestRegExp, [contextRegExp]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 忽略 moment 的本地化内容</span></span>
<span class="line"><span style="color:#D73A49;">new</span><span style="color:#24292E;"> webpack.</span><span style="color:#6F42C1;">IgnorePlugin</span><span style="color:#24292E;">(</span><span style="color:#032F62;">/</span><span style="color:#D73A49;">^</span><span style="color:#22863A;font-weight:bold;">\\.\\/</span><span style="color:#032F62;">locale</span><span style="color:#D73A49;">$</span><span style="color:#032F62;">/</span><span style="color:#24292E;">,</span><span style="color:#032F62;"> /moment</span><span style="color:#D73A49;">$</span><span style="color:#032F62;">/</span><span style="color:#24292E;">);</span></span></code></pre></div>`,25),o=[e];function c(t,r,i,E,y,d){return a(),n("div",null,o)}const b=s(p,[["render",c]]);export{h as __pageData,b as default};
