<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID：112   7，营业执照号：914    406     0 5MA55  6   H1  KXH）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="hljs">
		<rich-text :nodes="code" space="nbsp"></rich-text>
	</view>
</template>

<script>
	import hljs from './high-light/index.js'
	// 支持的解析语言列表
	const LANGUAGE_LIST = [
		'javascript',
		'css',
		'xml',
		'sql',
		'typescript',
		'markdown',
		'c++',
		'c',
	];
	export default {
		name: "firstui-audio",
		props: {
			codeText: {
				type: String,
				default: ''
			},

			language: {
				type: String,
				default: 'javascript'
			}
		},
		data() {
			return {
				code: ''
			};
		},
		created() {
			this.parseCode(this.codeText, this.language)
		},
		methods: {
			parseCode(input, language) {
				const lang = LANGUAGE_LIST.includes(language) ? language : 'javascript'
				const {
					value
				} = hljs.highlight(lang, input)
				const highlighted = value.replace('&amp;', '&').trim()

				let codeResult = `<code class="${lang}">${highlighted}</code>`
				codeResult = codeResult.replace(/\n/g, "<br/>").replace('\<code\>', '')
				this.code = codeResult;
			}
		}
	}
</script>

<style>
	/*
	Style with support for rainbow parens
	*/
	.hljs {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		overflow-x: auto;
		padding: 0.5em;
		background: #282c34;
		color: #d1d9e1;
	}

	.hljs-comment,
	.hljs-quote {
		color: #969896;
		font-style: italic;
	}

	.hljs-keyword,
	.hljs-selector-tag,
	.hljs-literal,
	.hljs-type,
	.hljs-addition {
		color: #cc99cc;
	}

	.hljs-number,
	.hljs-selector-attr,
	.hljs-selector-pseudo {
		color: #f99157;
	}

	.hljs-string,
	.hljs-doctag,
	.hljs-regexp {
		color: #8abeb7;
	}

	.hljs-title,
	.hljs-name,
	.hljs-section,
	.hljs-built_in {
		color: #b5bd68;
	}

	.hljs-variable,
	.hljs-template-variable,
	.hljs-selector-id,
	.hljs-class .hljs-title {
		color: #ffcc66;
	}

	.hljs-section,
	.hljs-name,
	.hljs-strong {
		font-weight: bold;
	}

	.hljs-symbol,
	.hljs-bullet,
	.hljs-subst,
	.hljs-meta,
	.hljs-link {
		color: #f99157;
	}

	.hljs-deletion {
		color: #dc322f;
	}

	.hljs-formula {
		background: #eee8d5;
	}

	.hljs-attr,
	.hljs-attribute {
		color: #81a2be;
	}

	.hljs-emphasis {
		font-style: italic;
	}

	/* #ifdef VUE3 */
	:deep(.hljs-comment),
	:deep(.hljs-quote){
		color: #969896;
		font-style: italic;
	}

	:deep(.hljs-keyword),
	:deep(.hljs-selector-tag),
	:deep(.hljs-literal),
	:deep(.hljs-type),
	:deep(.hljs-addition) {
		color: #cc99cc;
	}

	:deep(.hljs-number),
	:deep(.hljs-selector-attr),
	:deep(.hljs-selector-pseudo) {
		color: #f99157;
	}

	:deep(.hljs-string),
	:deep(.hljs-doctag),
	:deep(.hljs-regexp) {
		color: #8abeb7;
	}

	:deep(.hljs-title),
	:deep(.hljs-name),
	:deep(.hljs-section),
	:deep(.hljs-built_in) {
		color: #b5bd68;
	}

	:deep(.hljs-variable),
	:deep(.hljs-template-variable),
	:deep(.hljs-selector-id),
	:deep(.hljs-class .hljs-title) {
		color: #ffcc66;
	}

	:deep(.hljs-section),
	:deep(.hljs-name),
	:deep(.hljs-strong) {
		font-weight: bold;
	}

	:deep(.hljs-symbol),
	:deep(.hljs-bullet),
	:deep(.hljs-subst),
	:deep(.hljs-meta),
	:deep(.hljs-link) {
		color: #f99157;
	}

	:deep(.hljs-deletion) {
		color: #dc322f;
	}

	:deep(.hljs-formula) {
		background: #eee8d5;
	}

	:deep(.hljs-attr),
	:deep(.hljs-attribute) {
		color: #81a2be;
	}

	:deep(.hljs-emphasis) {
		font-style: italic;
	}
	/* #endif */
</style>