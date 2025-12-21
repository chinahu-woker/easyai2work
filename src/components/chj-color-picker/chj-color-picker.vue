<template>
	<block v-if="!isCover">
	<view v-show="show" class="chj-color-picker">
		<view class="chj-color-picker-bg" style="position: absolute;top: 0;left: 0;height: 100%;"></view>
		<view class="chj-color-picker-dialog">
			<view class="chj-color-picker-title-box">
				<text @click="cancel">取消</text>
				<text>{{title}}</text>
				<text @click="change">确定</text>
			</view>
			<view class="chj-color-picker-main">
				<!-- 颜色选择区 -->
				<view class="chj-canvas-box">
					<canvas
					class="chj-color-picker-canvas" 
					id="chj-color-picker-canvas-bg" 
					canvas-id="chj-color-picker-canvas-bg">
					</canvas>
					<canvas 
					class="chj-color-picker-canvas" 
					id="chj-color-picker-canvas" 
					canvas-id="chj-color-picker-canvas"
					:disable-scroll="true"
					@touchstart="touchSelectColor"
					@touchmove="touchSelectColor">
					</canvas>
				</view>
				<view class="chj-select-color-box">
					<!-- 显示颜色选择区 -->
					<view class="chj-show-color">
						<canvas
						class="chj-canvas-show-color" 
						id="chj-canvas-show-color" 
						canvas-id="chj-canvas-show-color">
						</canvas>
					</view>	
					<view class="chj-slider-box">
						<!-- 颜色滑块 -->
						<view class="chj-canvas-slider">
							<canvas
							class="chj-canvas-color-slider" 
							id="chj-canvas-color-slider-bg" 
							canvas-id="chj-canvas-color-slider-bg">
							</canvas>
							<canvas 
							class="chj-canvas-color-slider" 
							id="chj-canvas-color-slider" 
							canvas-id="chj-canvas-color-slider"
							:disable-scroll="true"
							@touchstart="touchSlider"
							@touchmove="touchSlider">
							</canvas>
						</view>
						<!-- 透明度滑块 -->
						<view class="chj-canvas-slider" style="margin-top: 24rpx;">
							<canvas
							class="chj-canvas-color-slider" 
							id="chj-canvas-color-slider-tm-bg" 
							canvas-id="chj-canvas-color-slider-tm-bg">
							</canvas>
							<canvas 
							class="chj-canvas-color-slider" 
							id="chj-canvas-color-slider-tm" 
							canvas-id="chj-canvas-color-slider-tm"
							:disable-scroll="true"
							@touchstart="touchSliderTM"
							@touchmove="touchSliderTM">
							</canvas>
						</view>								
					</view>
				</view>
				<view class="chj-code-box">
					<view class="chj-code-but" @click="codeType=!codeType">
						切换模式
					</view>
					<input 
					v-if="codeType"
					class="chj-hex-inp" 
					placeholder="请输入正确的HEX代码" 
					v-model="hex" 
					@blur="initColor(hex)" />
					<view v-else class="chj-rgba-inp">
						<view class="chj-rgba-item">
							<input v-model="color.R" type="number" @blur="rgbaChange(color.R,'R')" />
							<text>R</text>
						</view>
						<view class="chj-rgba-item">
							<input v-model="color.G" type="number" @blur="rgbaChange(color.G,'G')"  />
							<text>G</text>
						</view>
						<view class="chj-rgba-item">
							<input v-model="color.B" type="number" @blur="rgbaChange(color.B,'B')"  />
							<text>B</text>
						</view>
						<view class="chj-rgba-item">
							<input v-model="opacity" type="digit" @blur="rgbaChange(opacity,'A')"  />
							<text>A</text>
						</view>
					</view>
					<view class="chj-code-but" @click="copy(codeType?hex:rgba)">
						复制
					</view>
				</view>
			</view>
		</view>
	</view>	
	</block>
	<block v-else>
	<view v-show="show" class="chj-color-picker">
		<cover-view class="chj-color-picker-bg" style="height: calc(100% - 636rpx);"></cover-view>
		<view class="chj-color-picker-dialog">
			<cover-view class="chj-color-picker-title-box chj-white-box">
				<cover-view @click="cancel">取消</cover-view>
				<cover-view>{{title}}</cover-view>
				<cover-view @click="change">确定</cover-view>
			</cover-view>
			<cover-view class="chj-white-box chj-white-box-w" />
			<view class="chj-flex-lr">
				<cover-view class="chj-white-box chj-white-box-h" />
				<!-- 颜色选择区 -->
				<view class="chj-canvas-box">
					<canvas
					class="chj-color-picker-canvas" 
					id="chj-color-picker-canvas-bg" 
					canvas-id="chj-color-picker-canvas-bg">
					</canvas>
					<canvas 
					class="chj-color-picker-canvas" 
					id="chj-color-picker-canvas" 
					canvas-id="chj-color-picker-canvas"
					:disable-scroll="true"
					@touchstart="touchSelectColor"
					@touchmove="touchSelectColor">
					</canvas>
				</view>
				<cover-view class="chj-white-box chj-white-box-h" />
			</view>
			<cover-view class="chj-white-box chj-white-box-w" />
			<view class="chj-flex-lr">
				<cover-view class="chj-white-box chj-white-box-h" />
				<view style="display: flex;flex: 1;">
					<!-- 显示颜色选择区 -->
					<view class="chj-show-color">
						<canvas
						class="chj-canvas-show-color" 
						id="chj-canvas-show-color" 
						canvas-id="chj-canvas-show-color">
						</canvas>
					</view>	
					<cover-view class="chj-white-box chj-white-box-h" />
					<view style="flex: 1;display: flex;flex-direction: column;">
						<!-- 颜色滑块 -->
						<view class="chj-canvas-slider">
							<canvas
							class="chj-canvas-color-slider" 
							id="chj-canvas-color-slider-bg" 
							canvas-id="chj-canvas-color-slider-bg">
							</canvas>
							<canvas 
							class="chj-canvas-color-slider" 
							id="chj-canvas-color-slider" 
							canvas-id="chj-canvas-color-slider"
							:disable-scroll="true"
							@touchstart="touchSlider"
							@touchmove="touchSlider">
							</canvas>
						</view>
						<cover-view class="chj-white-box chj-white-box-w" />
						<!-- 透明度滑块 -->
						<view class="chj-canvas-slider">
							<canvas
							class="chj-canvas-color-slider" 
							id="chj-canvas-color-slider-tm-bg" 
							canvas-id="chj-canvas-color-slider-tm-bg">
							</canvas>
							<canvas 
							class="chj-canvas-color-slider" 
							id="chj-canvas-color-slider-tm" 
							canvas-id="chj-canvas-color-slider-tm"
							:disable-scroll="true"
							@touchstart="touchSliderTM"
							@touchmove="touchSliderTM">
							</canvas>
						</view>
					</view>
				</view>
				<cover-view class="chj-white-box chj-white-box-h" />
			</view>
			<cover-view class="chj-show-code-box chj-white-box">
				<cover-view class="chj-code-but cover-view" @click="codeType=!codeType">切换</cover-view>
				<cover-view class="chj-hex-inp cover-view">{{codeType?hex:`rgba(${color.R},${color.G},${color.B},${opacity})`}}</cover-view>				
				<cover-view class="chj-code-but cover-view" @click="copy(codeType?hex:rgba)">复制</cover-view>
			</cover-view>
		</view>
	</view>
	</block>
</template>
<script>
	function preventScroll(e) {
		e.preventDefault(); // 阻止触摸滚动
	};
	export default {
		name: "chj-color-picker",
		props: {
			// 标题
			title: {
				type: String,
				default: "选择颜色"
			},
			// 初始化颜色,格式为 HEX
			defaultColor:{
				type: String,
				default: "#ff0000"
			},
			// 如果是微信小程序或者APP出现被 canvas、map 等组件覆盖的情况请设置此参数
			isCover:{
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				// 是否显示
				show:false,
				// canvas背景上下文
				ctx_bg: null,
				// 标注点canvas上下文
				ctx: null,
				// 渐变上下文
				grd: null,
				// canvas的宽度
				canvasWidth: 0,
				// canvas的高度
				canvasHeight: 0,
				// 当前选中的颜色rbga
				color:{R:255,G:0,B:0},
				// 当前选择的位置
				color_positinon:{x:0,y:0},
				// 滑块颜色
				slider_color:{R:255,G:0,B:0},
				// 当前滑块选择的位置
				slider_color_positinon:{x:0,y:0},
				// 透明度
				opacity:1,
				// 切换模式 true 为hex false 为rgba
				codeType:true,
				// 颜色代码
				hex:"",
			};
		},
		methods: {
			// 初始化颜色显示canvas
			async initColorShow(){
				// 初始化背景图
				const ctx_bg = uni.createCanvasContext('chj-canvas-show-color',this);
				const {width,height} = await this.getNodeInfo('.chj-canvas-show-color');
				// 绘制网格
				// 网格的宽高
				const size = height/6;
				for(let i=0;i<width/size;i++){
					for(let j=0;j<6;j++){
						if(i%2){
							if(j%2){
								ctx_bg.setFillStyle('#fff');
								ctx_bg.fillRect(i*size, j*size, size, size);
							}else{
								ctx_bg.setFillStyle('#c0c2c3');
								ctx_bg.fillRect(i*size, j*size, size, size);
							}
						}else{
							if(j%2){
								ctx_bg.setFillStyle('#c0c2c3');
								ctx_bg.fillRect(i*size, j*size, size, size);
							}else{
								ctx_bg.setFillStyle('#fff');
								ctx_bg.fillRect(i*size, j*size, size, size);
							}
						}
					}
				}
				const {R,G,B} = this.color;
				ctx_bg.setFillStyle(`rgba(${R},${G},${B},${this.opacity})`);
				ctx_bg.fillRect(0, 0, width, height);
				ctx_bg.draw();
			},
			// 初始化滑动条canvas
			async initCanvasSlider(){
				// 初始化背景图
				const ctx_bg = uni.createCanvasContext('chj-canvas-color-slider-bg',this);
				const {width,height} = await this.getNodeInfo('.chj-canvas-color-slider');
				const grd = ctx_bg.createLinearGradient(0, 0, width, 0);
				grd.addColorStop(0, 'rgb(255,0,0)');
				grd.addColorStop(0.16, 'rgb(255,255,0)');
				grd.addColorStop(0.33, 'rgb(0,255,0)');
				grd.addColorStop(0.5, 'rgb(0,255,255)');
				grd.addColorStop(0.66, 'rgb(0,0,255)');
				grd.addColorStop(0.83, 'rgb(255,0,255)');
				grd.addColorStop(1, 'rgb(255,0,0)');
				ctx_bg.setFillStyle(grd);
				ctx_bg.fillRect(0, 0, width, height);
				ctx_bg.draw();
			},
			// 绘制滑块
			async drawHK({x,y}){
				this.slider_color_positinon = {x,y};
				const {height} = await this.getNodeInfo('.chj-canvas-color-slider');
				const ctx = uni.createCanvasContext('chj-canvas-color-slider',this);
				ctx.arc(x, height/2, 10, 0, 2 * Math.PI);
				ctx.setStrokeStyle('#fff');
				ctx.setLineWidth(3);
				ctx.stroke();
				ctx.draw();
			},
			// 滑块监听
			async touchSlider(e){
				const {width} = await this.getNodeInfo('.chj-canvas-color-slider');
				let {x,y} = e.touches[0];
				// 超出canvas
				if(e.touches[0].x>width){
					x = width;
				}
				if(e.touches[0].x<0){
					x = 0;
				}
				// 计算出色调
				const h = (x / width) * 360;
				this.slider_color = this.hsvToRgb(h,1,1);
				const {R,G,B} = this.slider_color;
				// 绘制标注点
				this.drawHK({x,y});
				// 改变背景色
				this.setCanvasBgColor(`rgba(${R},${G},${B},${1})`);
				// 更新选择的颜色
				this.touchSelectColor({touches:[this.color_positinon]});
			},
			// 初始化透明度滑动条canvas
			async initCanvasSliderTM(){
				// 初始化背景图
				const ctx_bg = uni.createCanvasContext('chj-canvas-color-slider-tm-bg',this);
				const {width,height} = await this.getNodeInfo('.chj-canvas-color-slider');
				// 绘制网格
				// 网格的宽高
				const size = height/2;
				for(let i=0;i<width/size;i++){
					if(i%2){
						ctx_bg.setFillStyle('#fff');
						ctx_bg.fillRect(i*size, 0, size, size);
						ctx_bg.setFillStyle('#c0c2c3')
						ctx_bg.fillRect(i*size, size, size, size);
					}else{
						ctx_bg.setFillStyle('#c0c2c3');
						ctx_bg.fillRect(i*size, 0, size, size);
						ctx_bg.setFillStyle('#fff')
						ctx_bg.fillRect(i*size, size, size, size);
					}
				}
				// 绘制渐变透明
				const grd = ctx_bg.createLinearGradient(0, 0, width, 0);
				grd.addColorStop(0, 'transparent');
				const {R,G,B} = this.color;
				grd.addColorStop(1, `rgba(${R},${G},${B},${1})`);
				ctx_bg.setFillStyle(grd);
				ctx_bg.fillRect(0, 0, width, height);
				ctx_bg.draw();
			},
			// 绘制滑块(透明度)
			async drawTM({x,y}){
				const {height,width} = await this.getNodeInfo('.chj-canvas-color-slider');
				const ctx = uni.createCanvasContext('chj-canvas-color-slider-tm',this);
				ctx.arc(x, height/2, 10, 0, 2 * Math.PI);
				ctx.setStrokeStyle('#fff');
				ctx.setLineWidth(3);
				ctx.stroke();
				ctx.draw();
				// 计算出透明度
				this.opacity = (x/width).toFixed(2);
				// 显示当前颜色
				this.initColorShow();
			},
			// 滑块监听(透明度)
			async touchSliderTM(e){
				const {width} = await this.getNodeInfo('.chj-canvas-color-slider');
				let {x,y} = e.touches[0];
				// 超出canvas
				if(e.touches[0].x>width){
					x = width;
				}
				if(e.touches[0].x<0){
					x = 0;
				}
				// 绘制标注点
				this.drawTM({x,y});
			},
			// 确定
			change(){
				const {R,G,B} = this.color;
				this.$emit('change',{hex:this.hex,rgba:{...this.color,A:Number(this.opacity)}});
				this.show = false;
				// #ifdef H5
				// 取消阻止触摸屏幕时页面滚动
				window.removeEventListener('touchmove', preventScroll, { passive: false });
				// #endif
			},
			// 取消
			cancel(){
				this.$emit('cancel');
				this.show = false;
				// #ifdef H5
				// 取消阻止触摸屏幕时页面滚动
				window.removeEventListener('touchmove', preventScroll, { passive: false });
				// #endif
			},
			// 初始化
			async init(){
				// #ifdef H5
				// 阻止触摸屏幕时页面滚动
				window.addEventListener('touchmove', preventScroll, { passive: false });
				// #endif
				// 获取canvas的宽高
				const {width,height} = await this.getNodeInfo('.chj-color-picker-canvas');
				this.canvasWidth = width;
				this.canvasHeight = height;
				// 初始化背景图
				this.ctx = uni.createCanvasContext('chj-color-picker-canvas',this);
				this.ctx_bg = uni.createCanvasContext('chj-color-picker-canvas-bg',this);
				// 初始化滑块
				await this.initCanvasSlider();
				// 初始化透明度滑块
				await this.initCanvasSliderTM();
				// 显示当前颜色
				await this.initColorShow();
				// 根据颜色初始化颜色选择器
				await this.initColor(this.defaultColor);
			},
			// 绘制标注点
			drawBZ({x,y}){
				this.color_positinon = {x,y};
				this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
				this.ctx.setStrokeStyle('#EEEEEE');
				this.ctx.setLineWidth(3);
				this.ctx.stroke();
				this.ctx.draw();
			},
			// 设置canvas-bg的颜色
			setCanvasBgColor(color){
				this.grd = this.ctx_bg.createLinearGradient(0, 0, this.canvasWidth, 0);
				this.grd.addColorStop(0,'#fff');
				this.grd.addColorStop(1,color);
				this.ctx_bg.setFillStyle(this.grd);
				this.ctx_bg.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
				// 黑色到透明的渐变
				const grd_black = this.ctx_bg.createLinearGradient(0, this.canvasHeight, 0, 0);
				grd_black.addColorStop(0,'#000');
				grd_black.addColorStop(1,'transparent');
				this.ctx_bg.setFillStyle(grd_black);
				this.ctx_bg.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
				this.ctx_bg.draw();
			},
			// 颜色选中canvas监听
			touchSelectColor(e){
				let {x,y} = e.touches[0];
				// 超出canvas
				if(e.touches[0].x>this.canvasWidth){
					x = this.canvasWidth;
				}
				if(e.touches[0].x<0){
					x = 0;
				}
				if(e.touches[0].y>this.canvasHeight){
					y = this.canvasHeight;
				}
				if(e.touches[0].y<0){
					y = 0;
				}
				// 拿到色调
				const {R,G,B} = this.slider_color;
				const {h} = this.rgbToHsv(R,G,B);
				// 计算出饱和度
				const s = x / this.canvasWidth;
				// 计算出亮度
				const v = 1 - (y / this.canvasHeight);
				this.color = this.hsvToRgb(h,s,v);
				// 绘制标注点
				this.drawBZ({x,y});
				// 改变透明度滑块
				this.initCanvasSliderTM();
				// 显示当前颜色
				this.initColorShow();
			},			
			// 获取节点的信息（宽高）
			getNodeInfo(selector){
				return new Promise((res,rej)=>{
					uni.createSelectorQuery().in(this).select(selector).fields({
						size:true
					},(data)=>{
						res(data);
					}).exec();
				})
			},
			// 打开颜色选择器
			open(){
				this.show = true;
				const time = setTimeout(()=>{
					this.init();
					clearTimeout(time);
				},100)
			},
			// 将 RGB 值转换为两位十六进制
			rgbaToHex({R,G,B,A}) {
			    let rHex = Math.round(R).toString(16).padStart(2, '0');
			    let gHex = Math.round(G).toString(16).padStart(2, '0');
			    let bHex = Math.round(B).toString(16).padStart(2, '0');
				if(A==1) return `#${rHex}${gHex}${bHex}`;
				A*=255;
			    let aHex = Math.round(A).toString(16).padStart(2, '0');
				return `#${rHex}${gHex}${bHex}${aHex}`;
			},
			// hex 转 rgba
			hexToRgba(hex) {
				if(typeof hex != "string" || hex[0] != "#") return false;
				let alpha = 1;
				// 移除前导 #
				hex = hex.replace(/^#/, '');
				// 处理 3 位颜色代码
				if (hex.length === 3) {
					hex = hex.split('').map(char => char + char).join('');
				}
				// 处理 8 位颜色代码（带有透明度）
				if (hex.length === 8) {
					alpha = parseInt(hex.substring(6, 8), 16) / 255;
					hex = hex.substring(0, 6);
				}
				// 超出范围
				if (hex.length < 3 || hex.length == 4 || hex.length == 7 || hex.length > 8) {
					return false;
				}
				// 解析 R, G, B
				const R = parseInt(hex.substring(0, 2), 16);
				const G = parseInt(hex.substring(2, 4), 16);
				const B = parseInt(hex.substring(4, 6), 16);
				return {R,G,B,A:alpha};
			},
			// hsv 转 rgb
			hsvToRgb(h, s, v) {
				// 确保色相值在0到360之间
				h = h % 360;
				let r, g, b;
				let C = v * s;
				let X = C * (1 - Math.abs(((h / 60) % 2) - 1));
				let m = v - C;
				if (0 <= h && h < 60) {
					r = C; g = X; b = 0;
				} else if (60 <= h && h < 120) {
					r = X; g = C; b = 0;
				} else if (120 <= h && h < 180) {
					r = 0; g = C; b = X;
				} else if (180 <= h && h < 240) {
					r = 0; g = X; b = C;
				} else if (240 <= h && h < 300) {
					r = X; g = 0; b = C;
				} else if (300 <= h && h < 360) {
					r = C; g = 0; b = X;
				}
				return {
					R: Math.round((r + m) * 255),
					G: Math.round((g + m) * 255),
					B: Math.round((b + m) * 255)
				};
			},
			// rgb 转 hsv
			rgbToHsv(r, g, b) {
			  r /= 255;
			  g /= 255;
			  b /= 255;
			  let max = Math.max(r, g, b);
			  let min = Math.min(r, g, b);
			  let h, s, v = max;
			  let d = max - min;
			  s = max === 0 ? 0 : d / max;
			  if (d === 0) {
			    h = 0;
			  } else {
			    switch (max) {
			      case r:
			        h = (g - b) / d + (g < b ? 6 : 0);
			        break;
			      case g:
			        h = (b - r) / d + 2;
			        break;
			      case b:
			        h = (r - g) / d + 4;
			        break;
			    }
			    h /= 6;
			  }
			  return {
			    h: h * 360, // 0 - 360
			    s: s,
			    v: v 
			  };
			},
			// 复制颜色编码
			copy(data){
				uni.setClipboardData({
					data
				});
			},
			// 给一个颜色，颜色选择器初始化到这个颜色的选择位置
			async initColor(color){
				let r,g,b,a;
				if(typeof color == 'string'){
					const rgba = this.hexToRgba(color);
					if(!rgba) return;
					const {R,G,B,A} = rgba;
					r = R;
					g = G;
					b = B;
					a = A;
				}else{
					const {R,G,B,A} = color;
					r = R;
					g = G;
					b = B;
					a = A;
				}
				this.color = {R:r,G:g,B:b};
				this.opacity = a;
				const {h,s,v} = this.rgbToHsv(r,g,b);
				// 初始化颜色滑块
				const {width} = await this.getNodeInfo('.chj-canvas-color-slider');
				const slider_x = (h / 360) * width;
				this.touchSlider({touches:[{x:slider_x,y:0}]});
				// 初始化颜色选择
				const x = s * this.canvasWidth;
				const y = (1 - v) * this.canvasHeight;
				this.touchSelectColor({touches:[{x,y}]});
				// 初始化透明度滑块
				const slider_tm_x = a * width;
				this.touchSliderTM({touches:[{x:slider_tm_x,y:0}]});
			},
			// rgba改变进行判断
			rgbaChange(val,key){
				val = Number(val);
				this.minRgba(val,key);
				this.maxRgba(val,key);
				this.initColor({...this.color,A:this.opacity});
			},
			// rgba最小值
			minRgba(val,key){
				if(val < 0 && key != 'A') this.color[key] = 0; 
				if(val < 0 && key == 'A') this.opacity = 0; 
			},
			// rgba最大值
			maxRgba(val,key){
				if(val > 255 && key != 'A') this.color[key] = 255;
				if(val > 1 && key == 'A') this.opacity = 1; 
			},
		},
		watch:{
			color:{
				handler(newVal){
					const {R,G,B} = newVal;
					this.hex = this.rgbaToHex({R,G,B,A:this.opacity});
				},
				immediate:true,
				deep:true
			},
			opacity:{
				handler(newVal){
					this.hex = this.rgbaToHex({R:this.color.R,G:this.color.G,B:this.color.B,A:newVal});
				},
				immediate:true,
				deep:true
			},
		},
		mounted(){
			// #ifdef H5
			const element = document.getElementsByClassName('chj-color-picker')[0];
			element.style.height = window.innerHeight + 'px';
			// #endif
		},
		computed:{
			// rgba
			rgba(){
				const {R,G,B} = this.color;
				return `rgba(${R},${G},${B},${this.opacity})`
			}
		}
	}
</script>
<style scoped>
	.chj-color-picker{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 998;
		box-sizing: border-box;
	}
	.chj-color-picker-bg{
		background-color: rgba(0,0,0,0.5);
		width: 100%;
	}
	.chj-color-picker-dialog{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		padding-bottom: 48rpx;
	}
	.chj-color-picker-title-box{
		padding: 12rpx 24rpx;
		border-bottom: 1rpx #797979 solid;
		color: #797979;
		display: flex;
		justify-content: space-between;
	}
	.chj-color-picker-main{
		padding: 24rpx;
	}
	.chj-canvas-box{
		position: relative;
		height: 300rpx;
		width: 100%;
	}
	.chj-color-picker-canvas{
		width: 100%;
		height: 300rpx;
		position: absolute !important;
		left: 0;
		top: 0;
	}
	.chj-canvas-slider{
		width: 100%;
		height: 30rpx;
		position: relative;
	}
	.chj-canvas-color-slider{
		width: 100%;
		height: 100%;
		position: absolute !important;
		left: 0;
		top: 0;
	}
	.chj-select-color-box{
		display: flex;
		justify-content: center;
		margin-top: 24rpx;
	}
	.chj-slider-box{
		flex: 1;
		margin-left: 24rpx;
	}
	.chj-canvas-show-color{
		width: 84rpx;
		height: 84rpx;
	}
	.chj-show-color{
		border: 1rpx #c7c7c7 solid;
	}
	.chj-code-box{
		display: flex;
		justify-content: center;
		margin-top: 24rpx;
		color: #737373;
	}
	.chj-code-inp{
		flex: 1;
		margin: 0 24rpx;
		border: 1rpx #c7c7c7 solid;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.chj-code-but{
		box-sizing: border-box;
		width: 84rpx;
		height: 84rpx;
		border: 1rpx #c7c7c7 solid;
		border-radius: 12rpx;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		padding: 12rpx;
		/* 阴影 */
		box-shadow: 0 0 8rpx #c7c7c7;
	}
	.chj-hex-inp{
		flex: 1;
		height: 84rpx;
		margin: 0 24rpx;
		border: 1rpx #c7c7c7 solid;
		border-radius: 8rpx;
		text-align: center;
	}
	.chj-rgba-inp{
		flex: 1;
		height: 84rpx;
		margin: 0 24rpx;
		display: grid;
		grid-template-columns: repeat(4,1fr);
		grid-gap: 12rpx;
	}
	.chj-rgba-item{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.chj-rgba-item input{
		height: 50rpx;
		border: 1rpx #c7c7c7 solid;
		border-radius: 8rpx;
		text-align: center;
	}
	cover-view{
		z-index: 998;
	}
	canvas{
		z-index: 998;
	}
	.chj-white-box{
		background-color: #fff;
	}
	.chj-white-box-w{
		height: 24rpx;
	}
	.chj-white-box-h{
		width: 24rpx;
	}
	.chj-flex-lr{
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.chj-show-code-box{
		box-sizing: border-box;
		width: 100%;
		padding: 24rpx;
		display: flex;
		justify-content: space-between;
	}
	.chj-code-but.cover-view{
		white-space: initial;
		line-height: 60rpx;
	}
	.chj-hex-inp.cover-view{
		box-sizing: border-box;
		line-height: 84rpx;
	}
</style>
