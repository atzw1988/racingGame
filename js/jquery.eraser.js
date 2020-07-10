(function( $ ){
	var methods = {
        /*{size: 30,completeRatio: .1,completeFunction: showResetButton }*/
		init : function( options ) {
			return this.each(function(){
				var $this = $(this),
					data = $this.data('eraser');
				   if (!data) {
					var width = $this.width(),
						height = $this.height(),
						pos = $this.offset(),
						$canvas = $("<canvas/>"),
						canvas = $canvas.get(0),
						url= options.url,
                        globleData=options.globleData,
						size = (options && options.size)?options.size:40,
						completeRatio = ( options && options.completeRatio )?options.completeRatio:.7,
						completeFunction = ( options && options.completeFunction )?options.completeFunction:null,
						parts = [],
                        flag=0,
						colParts = Math.floor( width / size),
						numParts = colParts * Math.floor( height / size ),//获取点击共有的点数parts
						n = numParts,
						ctx = canvas.getContext("2d");
					$this.after( $canvas);
					canvas.id = this.id;
					canvas.className = this.className;
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage( this, 0, 0 ,width ,height );
					$this.remove();
					// prepare context for drawing operations
					ctx.globalCompositeOperation = "destination-out";//	在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。
					ctx.strokeStyle = 'rgba(255,0,0,255)';//源图像
					ctx.lineWidth = size;
					ctx.lineCap = "round";//两端为半圆形
					// bind events
					$canvas.bind('mousedown.eraser', methods.mouseDown);
					$canvas.bind('touchstart.eraser', methods.touchStart);
					$canvas.bind('touchmove.eraser', methods.touchMove);
					$canvas.bind('touchend.eraser', methods.touchEnd);
					// reset parts
					while( n-- ) parts.push(1);
					// store values
					data = {
						posX:pos.left,//canvas左上角位置X
						posY:pos.top,//canvas 左上角位置Y
						touchDown: false,
						touchID:-999,
						touchX: 0,
						touchY: 0,
						ptouchX: 0,
						ptouchY: 0,
                        globleData:globleData,
						canvas: $canvas,
						ctx: ctx,
						url:url,
						w:width,
						h:height,
						source: this,
						size: size,
						parts: parts,
						colParts: colParts,
						numParts: numParts,
						ratio: 0,
                        flag:flag,
						complete: false,
						completeRatio: completeRatio,
						completeFunction: completeFunction
					};
					$canvas.data('eraser', data);
					// listen for resize event to update offset values
					$(window).resize( function() {
						var pos = $canvas.offset();
						data.posX = pos.left;
						data.posY = pos.top;
					});
				}
			});
		},
      /*  msgListSecond:function(event,$this){
			$.ajax({
				url: URL + "/rest/scratchPage/selectInformation",
				type: 'GET',
				data: {"openid": globleData.openid},
				success: function (res) {
					if (res.code == 1) {
						$("#PM_img").on("click", function () {
                            $(".msgShow").hide();
							$(".show").fadeIn(300);
							if(res.rows.qqNumber){
								$(".QQ_msg").html(res.rows.qqNumber);
							}else{
								$(".QQ_msg").html("未查询到QQ号");
							}
							$(".changeMsg").fadeIn(300).siblings().fadeOut();
							$(".cm_change").on("click", function () {
								$(".personMsg").fadeIn(300).siblings().fadeOut(300);
							});
							$(".cm_sure").on("click", function () {
								$(".getPrizeShare").fadeIn(300).siblings().fadeOut(300)
							})

						});
						if(res.rows.id){
							localStorage.setItem("scratchId",res.rows.id);
						}
						$("#residueDegree").text(res.rows.residueDegree);
					} else {
						// layer.msg(res.msg, {icon: 0, time: 1500});
						$(".ms_detail").html("<div class='no_msg'>暂无中奖信息!</div>");
						$("#residueDegree").text(res.rows.residueDegree);
						$("#PM_img").on("click", function () {
							$(".msgShow").fadeIn(300);
						});
						$("#ms_close").on("click", function () {
							$(".msgShow").fadeOut(300);
						})
					}
				}
			})
		},*/
		touchStart: function( event ) {
			var $this = $(this),
				data = $this.data('eraser');
			   if (!data.touchDown ) {
				var t = event.originalEvent.changedTouches[0],
                    tx = t.pageX - data.posX,
                    ty = t.pageY - data.posY;
				//tx,ty 获取相当于canvas 的位置
                methods.evaluatePoint( data, tx, ty);
                data.flag++;
                /*if(data.flag==1){
                    var msg={};
                    msg.activity="1";
                    msg.openid=data.globleData.openid;
                    msg.nickname=data.globleData.nickname;
                    msg.subscribe=data.globleData.subscribe;
                    $.ajax({
                        url: URL+"/rest/scratchPage/startScratch",
                        type: "POST",
                        data: msg,
                        async: false,
                        dataType: "json",
                        success: function (res) {
                        	console.log(res);
                            if(res.rows.map.code==1){
                                if(res.rows.scratchPrizeType.typeNo==2){
                                    $("#mask_img_bg").html("<img src='img/weizhongjia.png'>");
                                    console.log($("#residueDegree").text());
                                    if( $("#residueDegree").text()==1){
                                        $(".losePrize").fadeIn(300).siblings().fadeOut(300);
                                    }else{
                                        //刷新界面
										setTimeout(function(){
                                            var mathRandom = getParam("mathRandom");
                                            var mathRandomFloat =  10000*Math.random();
                                            if(mathRandom){
                                                window.location.href=window.location.href+"1";
                                            }else{
                                                window.location.href=window.location.href+"&mathRandom="+mathRandomFloat;
                                            }
										},1000)

									}
								}
                                if(res.rows.scratchPrizeType.typeNo==1){
                                    $("#mask_img_bg").html("<img src='img/prize.png'>");
                                    localStorage.setItem("nickname",res.rows.gameUser.nickname);
                                    $(".getPrize").fadeIn(300).siblings().fadeOut(300);
                                    $(".gitBtn").on("click",function(){
                                        $(".personMsg").fadeIn(300).siblings().fadeOut(300);
                                        localStorage.setItem("scratchId",res.rows.gameUser.gameUserDetailId)
                                    })
								}
								//重新个人中奖信息
                                methods.msgListSecond(event,$this);
                             }else if(res.rows.map.code==3){
                                $("#mask_img_bg").html("<img src='img/weizhongjia.png'>");
                            	$(".attention").fadeIn(300);
                                $(".show").fadeOut(300);
                            	$("#a_close").on("click",function(){
                                    $(".show").fadeOut(300);
                                    $(".attention").fadeOut(300);
								})
							 }
							 // else if(res.rows.map.code==3){
                              //   //$("#mask_img_bg").html("活动尚未开始<br>");
                              //   //layer.msg(res.rows.map.msg,{icon:0, time: 1500});
						  	// }
							 else{
                                $("#mask_img_bg").html(res.rows.map.msg);
                                // $("#mask_img_bg").html("<img src='img/weizhongjia.png'>");
								// layer.msg(res.rows.map.msg,{icon: 1, time: 1500});
								//$(".show").hide()
								// $("#go").show()
							}

                        },
                        error: function () {

                        }
                    });
                }*/
                data.touchDown=true;
				data.touchID = t.identifier;
				data.touchX = tx;
				data.touchY = ty;
				event.preventDefault();
			}
		},
		touchMove: function( event ) {
			var $this = $(this),
				data = $this.data('eraser');
			if ( data.touchDown ) {
				var ta = event.originalEvent.changedTouches,
					n = ta.length;
				while( n-- )
					if ( ta[n].identifier == data.touchID ) {
						var tx = ta[n].pageX - data.posX,
							ty = ta[n].pageY - data.posY;
						methods.evaluatePoint( data, tx, ty );
						data.ctx.beginPath();
						data.ctx.moveTo( data.touchX, data.touchY );
						data.touchX = tx;
						data.touchY = ty;
						data.ctx.lineTo( data.touchX, data.touchY );
						data.ctx.stroke();
						event.preventDefault();
						break;
			        }
		      	}
	  	},
		touchEnd: function( event ) {
			var $this = $(this),
				data = $this.data('eraser');
			if ( data.touchDown ) {
				var ta = event.originalEvent.changedTouches,
					n = ta.length;
				while( n-- )
					if ( ta[n].identifier == data.touchID ) {
						data.touchDown = false;
						event.preventDefault();
						break;
				}
			}
		},
		evaluatePoint: function( data, tx, ty ) {
			var p = Math.floor(tx/data.size) + Math.floor( ty / data.size ) * data.colParts;
			if ( p >= 0 && p < data.numParts ) {
				data.ratio += data.parts[p];
				data.parts[p] = 0;
				if ( !data.complete) {
					if (data.ratio/data.numParts>= data.completeRatio) {
						data.complete = true;
						if ( data.completeFunction != null ) data.completeFunction();
					}
				}
			}
		},
	  	mouseDown: function( event ) {
			var $this = $(this),
				data = $this.data('eraser'),
                tx = event.pageX - data.posX,
                ty = event.pageY - data.posY;
		     	methods.evaluatePoint( data, tx, ty );
            data.touchX = tx;
            data.touchY = ty;
            data.ctx.beginPath();
            data.ctx.moveTo( data.touchX-1, data.touchY );
            data.ctx.lineTo( data.touchX, data.touchY );
            data.ctx.stroke();
			if(!data.touchDown){
                data.touchDown = true;
                data.flag++;
                 /*    if(data.flag==1){
                    var msg={};
                    msg.activity="1";
                    msg.openid="123456";
                    msg.nickname='胡青丰';
                    msg.subscribe=1;
                    $.ajax({
                        url: data.url+"/rest/scratchPage/startScratch",
                        type: "POST",
                        data: msg,
                        dataType: "json",
                        success: function (res) {
                            if(res.rows.map.code==1&&res.rows.scratchPrizeType.typeNo==2){
                                $("#mask_img_bg").html("<img src='img/weizhongjia.png'>");
                                $(".losePrize").show().siblings().hide();
                            }
                            if(res.rows.map.code==1&&res.rows.scratchPrizeType.typeNo==1){
                                console.log(res.rows.scratchPrizeType);
                                $("#mask_img_bg").html("<img src='img/prize.png'>");
                                $(".getPrize").show().siblings().hide();
                                $(".gitBtn").on("click",function(){
                                    $(".personMsg").show().siblings().hide();
                                    localStorage.setItem("id",res.rows.scratchPrizeType.id)
                                })
                            }
                        },
                        error: function (msg) {
                            console.log(msg)
                        }
                    });
                }*/
                $this.bind('mousemove.eraser', methods.mouseMove);
                $(document).bind('mouseup.eraser', data, methods.mouseUp);
			}
			event.preventDefault();
		},
		mouseMove: function( event ) {
			var $this = $(this),
				data = $this.data('eraser'),
				tx = event.pageX - data.posX,
				ty = event.pageY - data.posY;
			methods.evaluatePoint( data, tx, ty );
			data.ctx.beginPath();
			data.ctx.moveTo( data.touchX, data.touchY );
			data.touchX = tx;
			data.touchY = ty;
			data.ctx.lineTo( data.touchX, data.touchY );
			data.ctx.stroke();
			event.preventDefault();
		},

		mouseUp: function( event ) {
			var data = event.data,
				$this = data.canvas;
			data.touchDown = false;
			$this.unbind('mousemove.eraser');
			$(document).unbind('mouseup.eraser');
			event.preventDefault();
		},
		clear: function() {
			var $this = $(this),
				data = $this.data('eraser');
			if ( data )
			{
				data.ctx.clearRect( 0, 0, data.w, data.h );
				var n = data.numParts;
				while( n-- ) data.parts[n] = 0;
				data.ratio = data.numParts;
				data.complete = true;
				if ( data.completeFunction != null ) data.completeFunction();
			}
		},
		size: function(value) {
			var $this = $(this),
				data = $this.data('eraser');
			if ( data && value )
			{
				data.size = value;
				data.ctx.lineWidth = value;
			}
		},
		reset: function() {
			var $this = $(this),
				data = $this.data('eraser');
			if ( data )
			 {
			 	data.ctx.globalCompositeOperation = "source-over";
				data.ctx.drawImage( data.source, 0, 0 );
				data.ctx.globalCompositeOperation = "destination-out";
				var n = data.numParts;
				while( n-- ) data.parts[n] = 1;
				data.ratio = 0;
				data.complete = false;
			}
		}
	};
	$.fn.eraser = function( method ) {
		if ( methods[method] ) {
		return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not yet exist on jQuery.eraser' );
		}
	};
})( jQuery);
