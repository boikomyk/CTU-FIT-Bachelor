(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{9768:function(e,t,a){"use strict";a.r(t);var r=a(12),n=a.n(r),o=a(11),l=a.n(o),c=a(14),s=a.n(c),i=a(13),u=a.n(i),m=a(20),p=a.n(m),d=a(15),f=a.n(d),g=a(4),h=a.n(g),E=a(0),b=a.n(E),v=a(9),y=a.n(v),C=a(18),T=a(47),k=a(80),w=a.n(k),x=a(22),N=a(17),S=a(21),I=a(85),J=a(34),M=a.n(J),O=a(77),j=a(6),A=a(50);function B(e){return{type:j.k,loaded:e}}var D=function(){return function(e){return e({type:j.w}),O.a.getStrategies().then(function(t){var a=[];t.data.strategies.forEach(function(e){a.push(A.a.fromJSON(e))}),e(function(e){return{type:j.I,strategies:e}}(a)),e(B(!0))}).catch(function(){e(B(!1))})}},F=a(2);var H={dangerCellColor:{color:F.k},successCellColor:{color:F.I},cardTitle:F.f,cardIconTitle:{...F.f,marginTop:"15px",marginBottom:"0px","& small":{fontSize:"80%",fontWeight:"400"}},cardCategory:{marginTop:"10px",color:"#999999 !important",textAlign:"center"},description:{color:"#999999"},updateProfileButton:{float:"right"}},P=function(e){function t(e){var a;return n()(this,t),a=s()(this,u()(t).call(this,e)),h()(p()(a),"componentDidMount",function(){(0,a.props.loadStrategies)()}),h()(p()(a),"strategiesToTable",function(e){var t=a.props.classes,r=[];return e.forEach(function(e){var a=parseFloat(e.performance),n="";0===a&&(n=b.a.createElement("b",null,a+"%"," ")),a>0&&(n=b.a.createElement("b",{className:t.successCellColor},"+"+a+"%"," ")),a<0&&(n=b.a.createElement("b",{className:t.dangerCellColor},a+"%"," ")),r.push([b.a.createElement(M.a,{color:"primary",to:{pathname:"/dashboard/marketplace/"+e.id},component:C.a},e.name),e.author,e.type,e.followers,e.market,n])}),r}),a}return f()(t,e),l()(t,[{key:"render",value:function(){var e=this.props,t=e.classes,a=e.strategies;return e.loaded?b.a.createElement("div",null,b.a.createElement(N.a,null,b.a.createElement(N.b,{xs:12},b.a.createElement(S.a,null,b.a.createElement(S.c,{color:"primary",icon:!0},b.a.createElement(S.d,{color:"primary"},b.a.createElement(w.a,null)),b.a.createElement("h4",{className:t.cardIconTitle},"Marketplace")),b.a.createElement(S.b,null,b.a.createElement(I.a,{hover:!0,striped:!0,tableHeaderColor:"primary",tableHead:["Name","Author","Type","Followers","Market","Performance"],tableData:this.strategiesToTable(a)})))))):b.a.createElement("div",null)}}]),t}(b.a.Component);t.default=Object(T.g)(y()(H)(Object(x.connect)(function(e,t){return{loaded:e.strategies.loaded,strategies:e.strategies.strategies}},function(e){return{loadStrategies:function(){return e(D())}}})(P)))}}]);