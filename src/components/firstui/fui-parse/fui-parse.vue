<template>
	<!--本文件由FirstUI授权予佛山市航电梦联网络科技有限公司（会员ID： 11  27，营业执照号：9  1    4 40 605MA5 56H  1 K    X H）专用，请尊重知识产权，勿私下传播，违者追究法律责任。-->
	<view class="fui-parse__wrap">
		<block v-for="(item,index) in nodesData" :key="index">
			<!-- 判断是否为标签节点 -->
			<block v-if="item.node == 'element'">
				<!-- button类型 -->
				<block v-if="item.tag == 'button'">
					<button type="default" size="mini">
						<!-- 如果还有子节点，递归遍历自身 -->
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<fui-parse :nodes="child"></fui-parse>
						</block>
					</button>
				</block>

				<!-- code类型 -->
				<block v-else-if="item && item.tag == 'code'">
					<view class="mb10" :class="item.classStr" :style="item.styleStr">
						<firstui-code :codeText="item.content" :language="item.attr && item.attr.lang"></firstui-code>
					</view>
				</block>

				<!-- ol类型 -->
				<block v-else-if="item.tag == 'ol'">
					<view class="fuiParse-ol" :class="[item.classStr]" :style="item.styleStr">
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<view class="fuiParse-ol-inner">
								<view class="fuiParse-ol-number">{{idx + 1}}. </view>
								<view class="flex-full overflow-hide">
									<fui-parse :nodes="child"></fui-parse>
								</view>
							</view>
						</block>
					</view>
				</block>

				<!-- ul类型 -->
				<block v-else-if="item.tag == 'ul'">
					<view class="fuiParse-ul" :class="[item.classStr]" :style="item.style && item.style.Str">
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<view class="fuiParse-ul-inner">
								<view class="fuiParse-li-circle"></view>
								<view class="flex-full overflow-hide">
									<fui-parse :nodes="child"></fui-parse>
								</view>
							</view>
						</block>
					</view>
				</block>

				<!-- li类型 -->
				<block v-else-if="item.tag == 'li'">
					<view class="fuiParse-li" :class="[item.classStr]" :style="item.styleStr">
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<fui-parse :nodes="child"></fui-parse>
						</block>
					</view>
				</block>

				<!-- video类型 -->
				<block v-else-if="item.tag == 'video'">
					<!--增加video标签支持，并循环添加-->
					<view :class="[item.classStr,`fuiParse-${item.tag}`]" :style="item.styleStr">
						<video :class="[item.classStr,`fuiParse-${item.tag}-video`]"
							:src="item.attr && item.attr.src"></video>
					</view>
				</block>

				<!-- img类型 -->
				<block v-else-if="item.tag == 'img'">
					<view class="fuiParse-img-inner" v-if="item.attr && item.attr.src">
						<image :class="[item.classStr,`fuiParse-${item.tag}`,item.loaded ? 'fuiParse-img-fadein' : '']"
							:data-from="item.from" :data-src="item.attr.src" :data-idx="item.imgIndex" :lazy-load="true"
							:src="item.loaded ? item.attr.src : ''" @tap="fuiParseImgTap" :mode="mode"
							:style="'width:'+(item.attr.width || width)+'px;height:'+(item.attr.height || height)+'px;'+item.styleStr" />
						<image class="fuiParse-img__loading" :class="{'fuiParse-img__hidden':item.loaded}"
							src="data:image/png;base64,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" />
						<image style="display: none;" :mode="mode" :data-from="item.from" :data-index="index"
							:src="item.attr.src" @load="fuiParseImgLoad" />
					</view>
				</block>

				<!-- a类型 -->
				<block v-else-if="item.tag == 'a'">
					<view @tap="fuiParseTagATap" :class="[item.classStr,`fuiParse-${item.tag}`]" class="fuiParse-inline"
						:data-title="item.attr && item.attr.title" :data-src="item.attr && item.attr.href"
						:style="item.styleStr">
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<fui-parse :nodes="child"></fui-parse>
						</block>
					</view>
				</block>

				<!-- table类型 -->
				<block v-else-if="item.tag == 'table'">
					<view :class="[item.classStr,`fuiParse-${item.tag}`]">
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<fui-parse :nodes="child"></fui-parse>
						</block>
					</view>
				</block>

				<!-- tr 类型 -->
				<block v-else-if="item.tag == 'tr'">
					<view :class="[item.classStr,`fuiParse-${item.tag}`]">
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<fui-parse
								:class="[child.classStr,`fuiParse-${child.tag}`,`fuiParse-${child.tag}-container`,child.tag=='th' && thBgcolor?'fuiParse-th__bg':'']"
								:style="child.styleStr" :nodes="child"></fui-parse>
						</block>
					</view>
				</block>

				<!-- td 类型 -->
				<block v-else-if="item.tag == 'td'">
					<view :class="[item.classStr,`fuiParse-${item.tag}`]">
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<fui-parse
								:class="[child.classStr,`fuiParse-${child.tag}`,`fuiParse-${child.tag}-container`]"
								:style="child.styleStr" :nodes="child"></fui-parse>
						</block>
					</view>
				</block>

				<!-- audio类型 -->
				<block v-else-if="item.tag == 'audio'">
					<view class="fuiParse-audio">
						<firstui-audio class="fuiParse-audio-inner" :src="item.attr && item.attr.src"
							:title="item.attr && item.attr.title" :desc="item.attr && item.attr.desc"
							:class="[item.classStr]" :style="item.styleStr"></firstui-audio>
					</view>
				</block>

				<!-- br类型 -->
				<block v-else-if="item.tag == 'br'">
					<text>\n</text>
				</block>

				<!-- 其它块级标签 -->
				<block v-else-if="item.tagType == 'block'">
					<view :class="[item.classStr,`fuiParse-${item.tag}`]" :style="item.styleStr">
						<block v-for="(child,idx) in item.nodes" :key="idx">
							<fui-parse :nodes="child"></fui-parse>
						</block>
					</view>
				</block>

				<!-- 其它内联标签 -->
				<view v-else :class="[item.classStr,`fuiParse-${item.tag}`,`fuiParse-${item.tagType}`]"
					:style="item.styleStr">
					<block v-for="(child,idx) in item.nodes" :key="idx">
						<fui-parse :nodes="child"></fui-parse>
					</block>
				</view>
			</block>

			<!-- 判断是否为文本节点 -->
			<block v-else-if="item.node == 'text'">
				<view class="fuiEmojiView fuiParse-inline" :style="item.styleStr">
					<block v-for="(textItem,idx) in item.textArray" :key="idx">
						<block :class="[textItem.text == '\\n' ? 'fuiParse-hide':'']" v-if="textItem.node == 'text'">
							<text :selectable="true">{{textItem.text}}</text>
						</block>
						<block v-else-if="textItem.node == 'element'">
							<image class="fuiEmoji" :src="textItem.baseSrc+textItem.text" />
						</block>
					</block>
				</view>
			</block>
		</block>
	</view>
</template>

<script>
	import firstuiCode from './firstui-code.vue'
	import firstuiAudio from './firstui-audio.vue'
	import HtmlToJson from './utils/html2json.js';
	import marked from './marked/index.js'
	import util from './utils/util.js';
	const BIND_NAME = 'fuiParse'
	export default {
		name: "fui-parse",
		inject: {
			parsegroup: {
				value: "parsegroup",
				default: null
			}
		},
		components: {
			firstuiCode,
			firstuiAudio
		},
		props: {
			// 可选：html | markdown (md)
			language: {
				type: String,
				default: 'html'
			},
			nodes: {
				type: [String, Object, Array],
				default: ''
			}
		},
		watch: {
			nodes: {
				handler(val) {
					if (!val) return;
					// 采用markdown解析
					if (this.language === 'markdown' || this.language === 'md') {
						const parseNodes = marked(val);
						setTimeout(() => {
							this._parseNodes(parseNodes)
						}, 0);
					} else {
						// 默认采用html解析
						setTimeout(() => {
							this._parseNodes(val)
						}, 0)
					}
				},
				immediate: true
			}
		},
		// #ifndef VUE3
		beforeDestroy() {
			// 组件销毁，清除绑定实例
			util.cacheInstance.remove(this.pageNodeKey)
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			// 组件销毁，清除绑定实例
			util.cacheInstance.remove(this.pageNodeKey)
		},
		// #endif
		data() {
			return {
				pageNodeKey: '',
				nodesData: [],
				bindData: {},
				width: 0,
				height: 0,
				thBgcolor: true,
				mode: ''
			};
		},
		created() {
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.parsegroup) {
						this.thBgcolor = this.parsegroup.thBgcolor
					}
					this.mode = 'widthFix'
				}, 50)
			})
		},
		methods: {
			_parseNodes(nodes) {
				// 设置页面唯一键值标识符
				this.pageNodeKey = this.parsegroup ? this.parsegroup.pageNodeKey : BIND_NAME;
				if (typeof nodes === 'string') { // 初始为html富文本字符串
					this._parseHtml(nodes)
				} else if (Array.isArray(nodes)) { // html 富文本解析成节点数组
					this.nodesData = nodes;
				} else { // 其余为单个节点对象
					this.nodesData = [nodes];
				}
			},

			_parseHtml(html) {
				//存放html节点转化后的json数据
				const transData = HtmlToJson.html2json(html, this.pageNodeKey)
				transData.view = {}
				transData.view.imagePadding = 0
				this.nodesData = transData.nodes;
				this.bindData = {
					[this.pageNodeKey]: transData
				}
				util.cacheInstance.set(this.pageNodeKey, transData)
			},

			/**
			 * 图片视觉宽高计算函数区
			 * @param {*} e
			 */
			fuiParseImgLoad(e) {
				// 获取当前的image node节点
				const {
					from: tagFrom,
					index
				} = (e.target.dataset || e.currentTarget.dataset || {})
				if (typeof tagFrom !== 'undefined' && tagFrom.length > 0) {
					const {
						width,
						height
					} = e.detail

					//因为无法获取view宽度 需要自定义padding进行计算，稍后处理
					const recal = this._fuiAutoImageCal(width, height)
					this.width = recal.imageWidth;
					this.height = recal.imageHeight;
					const nodesData = this.nodesData;
					nodesData[index].loaded = true;
					this.nodesData = nodesData;
				}
			},

			/**
			 * 预览图片
			 * @param {*} e
			 */
			fuiParseImgTap(e) {
				const {
					src
				} = (e.target.dataset || e.currentTarget.dataset)

				let {
					imageUrls = []
				} = util.cacheInstance.get(this.pageNodeKey)
				if (imageUrls.length == 0) {
					imageUrls = [src]
				}

				if (this.parsegroup) {
					if (this.parsegroup.imgPreview) {
						uni.previewImage({
							current: src,
							urls: imageUrls
						})
					}
					this.parsegroup.previewImage(src, imageUrls)
				} else {
					uni.previewImage({
						current: src,
						urls: imageUrls
					})
				}
			},

			/**
			 * 计算视觉优先的图片宽高
			 * @param {*} originalWidth
			 * @param {*} originalHeight
			 */
			_fuiAutoImageCal(originalWidth, originalHeight) {
				let autoWidth = 0,
					autoHeight = 0;
				const results = {}
				const [windowWidth, windowHeight] = util.getSystemInfo()

				// 判断按照哪种方式进行缩放
				if (originalWidth > windowWidth) { //在图片width大于手机屏幕width时候
					autoWidth = windowWidth
					autoHeight = (autoWidth * originalHeight) / originalWidth
					results.imageWidth = autoWidth
					results.imageHeight = autoHeight
				} else { // 否则展示原来数据
					results.imageWidth = originalWidth
					results.imageHeight = originalHeight
				}
				return results
			},

			/**
			 * 增加a标签跳转
			 * @param {*} e
			 */
			fuiParseTagATap(e) {
				const {
					src = ''
				} = e.currentTarget.dataset

				if (this.parsegroup) {
					this.parsegroup.onATap(src)
					return
				}
				// 判断是否内部链接跳转
				const isInnerPage = src.indexOf('http') === -1
				if (isInnerPage) {
					uni.navigateTo({
						url: src
					})
				}
			}
		}
	}
</script>

<style scoped>
	.fui-parse__wrap {
		display: inline;
		max-width: 100%;
		font-weight: normal;
	}

	.fuiParse {
		margin: 0 5px;
		font-family: Helvetica, sans-serif;
		font-size: 28rpx;
		color: #666;
		line-height: 1.8;
	}

	.fuiParse-inline {
		display: inline;
		margin: 0;
		padding: 0;
		line-height: 1.75;
	}

	.mb10 {
		margin-bottom: 0.63em;
	}

	/*//标题 */
	.fuiParse-div {
		/* margin: 0; */
		padding: 0;
	}

	.fuiParse-h1 {
		font-size: 2em;
		margin: .67em 0
	}

	.fuiParse-h2 {
		font-size: 1.5em;
		margin: .75em 0
	}

	.fuiParse-h3 {
		font-size: 1.17em;
		margin: .83em 0
	}

	.fuiParse-h4 {
		margin: 1.12em 0
	}

	.fuiParse-h5 {
		font-size: .83em;
		margin: 1.5em 0
	}

	.fuiParse-h6 {
		font-size: .75em;
		margin: 1.67em 0
	}

	.fuiParse-h1 {
		font-size: 18px;
		font-weight: 500;
		margin-bottom: .9em;
	}

	.fuiParse-h2 {
		font-size: 16px;
		font-weight: 500;
		margin-bottom: .34em;
	}

	.fuiParse-h3 {
		font-weight: 500;
		font-size: 15px;
		margin-bottom: .34em;
	}

	.fuiParse-h4 {
		font-weight: 500;
		font-size: 14px;
		margin-bottom: .24em;
	}

	.fuiParse-h5 {
		font-weight: 500;
		font-size: 13px;
		margin-bottom: .14em;
	}

	.fuiParse-h6 {
		font-weight: 500;
		font-size: 12px;
		margin-bottom: .04em;
	}

	.fuiParse-h1,
	.fuiParse-h1 text,
	.fuiParse-h2,
	.fuiParse-h2 text,
	.fuiParse-h3,
	.fuiParse-h3 text,
	.fuiParse-h4,
	.fuiParse-h4 text,
	.fuiParse-h5,
	.fuiParse-h5 text,
	.fuiParse-h6,
	.fuiParse-h6 text,
	.fuiParse-b,
	.fuiParse-b text,
	.fuiParse-strong,
	.fuiParse-strong text {
		font-weight: bold;
	}

	.fuiParse-i,
	.fuiParse-i text,
	.fuiParse-cite,
	.fuiParse-em,
	.fuiParse-em text,
	.fuiParse-var,
	.fuiParse-address,
	.fuiParse-address text {
		font-style: italic
	}

	.fuiParse-pre,
	.fuiParse-tt,
	.fuiParse-code,
	.fuiParse-kbd,
	.fuiParse-samp {
		font-family: monospace
	}

	.fuiParse-pre {
		white-space: pre;
		overflow-x: scroll;
		background: #f5f5f5;

	}

	.fuiParse-p {
		max-width: 100%;
		word-break: break-all;
		white-space: pre-wrap;
		box-sizing: border-box;
	}

	.fuiParse-section {
		max-width: 100%;
		overflow: hidden;
		white-space: pre-wrap;
		box-sizing: border-box;
	}

	.fuiParse-big {
		font-size: 1.17em
	}

	.fuiParse-small,
	.fuiParse-sub,
	.fuiParse-sup {
		font-size: .83em
	}

	.fuiParse-sub {
		vertical-align: sub
	}

	.fuiParse-sup {
		vertical-align: super
	}

	.fuiParse-s,
	.fuiParse-strike,
	.fuiParse-del {
		text-decoration: line-through
	}

	/*fuiParse-自定义个性化的css样式*/
	/*增加video的css样式*/
	.fuiParse-strong,
	.fuiParse-s {
		display: inline
	}

	.fuiParse-a {
		word-break: break-all;
		overflow: auto;
		color: var(--fui-color-link, #465CFF);

	}

	/* #ifdef H5 */
	.fuiParse-a text {
		cursor: pointer;
	}

	/* #endif */

	.fuiParse-video {
		max-width: 100% !important;
		text-align: center;
		margin: 10px 0;
	}

	.fuiParse-video-video {
		width: 100%;
	}

	.fuiParse-blockquote {
		padding: 10px 0 10px 5px;
		font-family: Courier, Calibri, "宋体";
		background: #f5f5f5;
		border-left: 3px solid #dbdbdb;
	}

	.fuiParse-code,
	.fuiParse-code-style {
		background: #f5f5f5;
		line-height: 1.75;
	}

	.fuiParse-li,
	.fuiParse-li-inner {
		align-items: baseline;
		margin: 10rpx 0;
	}

	.fuiParse-li-text {
		flex-direction: row;
		align-items: center;
		line-height: 20px;
	}

	.fuiParse-li-circle,
	.fuiParse-ol-number {
		margin: 10rpx 10rpx 10rpx 0;
	}

	.fuiParse-li-circle {
		display: inline-flex;
		width: 5px;
		height: 5px;
		margin-top: 34rpx !important;
		background-color: #333;
		border-radius: 50%;
	}

	.fuiParse-li-square {
		display: inline-flex;
		width: 10rpx;
		height: 10rpx;
		background-color: #333;
		margin-right: 5px;
	}

	.fuiParse-li-ring {
		display: inline-flex;
		width: 10rpx;
		height: 10rpx;
		border: 2rpx solid #333;
		border-radius: 50%;
		background-color: #fff;
		margin-right: 5px;
	}

	.fuiParse-u {
		text-decoration: underline;
	}

	.fuiParse-hide {
		display: none;
	}

	.fuiEmojiView {
		align-items: center;
	}

	.fuiEmoji {
		width: 16px;
		height: 16px;
	}

	.fuiParse-table {
		border-bottom: 1px solid #e0e0e0;
		font-size: 0;
		overflow-x: scroll;
	}

	.fuiParse-tr {
		display: flex;
		flex-direction: row;
		border-right: 1px solid #e0e0e0;
	}

	.fuiParse-th,
	.fuiParse-td {
		flex: 1;
		padding: 5px;
		font-size: 28rpx;
		word-break: break-all;
		text-align: center;
	}

	.fuiParse-th image,
	.fuiParse-td image,
	.fuiParse-td .fuiParse-img {
		width: 100% !important;
	}

	.fuiParse-th-container,
	.fuiParse-td-container {
		border-left: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0
	}

	.fuiParse-td:last {
		border-top: 1px solid #e0e0e0;
	}

	.fuiParse-th__bg {
		background: #f0f0f0;
	}

	.fuiParse-del {
		/* #ifndef APP-NVUE */
		display: inline;
		/* #endif */
	}

	.fuiParse-figure {
		overflow: hidden;
	}

	.fuiParse-ol-inner,
	.fuiParse-ul-inner {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: flex-start;
		flex-direction: row;
		line-height: 28px;
	}

	.fuiParse-img-inner {
		position: relative;
		min-height: 100rpx;
	}

	.fuiParse-img {
		background-color: #efefef;
		overflow: hidden;
		max-width: 100%;
		width: 100%;
		display: block;
	}

	/* #ifndef APP-NVUE */
	.fuiParse-img-fadein {
		animation: fade-in 1s linear;
	}

	/* #endif */

	.fuiParse-img-inner .fuiParse-img__loading {
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -30rpx;
		margin-left: -30rpx;
		/* #ifndef APP-NVUE */
		animation: loading 1s linear 0s infinite;
		/* #endif */
		width: 60rpx !important;
		height: 60rpx !important;
	}

	/* audio */
	.fuiParse-audio-inner {
		width: 100%;
		height: 200rpx;
	}

	/* common */
	.mr5 {
		margin-right: 5px;
	}

	.flex-full {
		flex: 1;
	}

	.overflow-hide {
		overflow: hidden;
	}

	/* #ifndef APP-NVUE */
	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	/* #endif */

	.fuiParse-img__hidden {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}
</style>