import{_ as n,o as e,c as i,a as s}from"./app-af0774fa.js";const a="/vuepress-blogs/images/linux/reverse-proxy.png",l={},d=s(`<p>负载均衡分为硬件负载均衡和软件负载均衡。</p><p>硬件负载均衡解决方案时直接在服务器和外部网络间安装负载均衡设备，这种设备我们通常称之为负载均衡器，负载均衡器产品有<code>F5</code>、<code>NetScaler</code>等。</p><p>软件负载均衡解决方案是指在一台或多台服务器相应的操作系统上安装一个或多个附加软件来实现负载均衡，它的优点是基于特定环境，配置简单，使用灵活，成本低廉，可以满足一般的负载均衡需求。目前比较流行的就三类软件负载均衡，<code>LVS</code>、<code>Ngnix</code>和<code>HAProxy</code>。</p><h1 id="nginx演示" tabindex="-1"><a class="header-anchor" href="#nginx演示" aria-hidden="true">#</a> Nginx演示</h1><h2 id="准备工作" tabindex="-1"><a class="header-anchor" href="#准备工作" aria-hidden="true">#</a> 准备工作</h2><ul><li>安装ngnix</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#首先安装nginx前置软件</span>
yum <span class="token parameter variable">-y</span> <span class="token function">install</span> gcc pcre-devel zlib-devel openssl-devel
<span class="token comment">#下载ngnix软件包</span>
<span class="token builtin class-name">cd</span> /data/tmp
<span class="token function">wget</span> https://nginx.org/download/nginx-1.26.1.tar.gz
<span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> ngnix-1.26.1.tar.gz 
<span class="token builtin class-name">cd</span> nginx-1.26.1
<span class="token comment">#设置安装目录为/usr/local/nginx</span>
./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr/local/nginx
<span class="token function">make</span>
<span class="token function">make</span> <span class="token function">install</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token environment constant">$PATH</span>:/usr/local/nginx/sbin <span class="token comment">#添加到系统变量或</span>
/usr/local/nginx/sbin/nginx <span class="token parameter variable">-v</span> <span class="token comment">#直接运行</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问80端口，出现如下页面表示nginx运行成功</p><p>![nginx页面](/images/linux/nginx sucess.png)</p><h2 id="nginx常用命令" tabindex="-1"><a class="header-anchor" href="#nginx常用命令" aria-hidden="true">#</a> Nginx常用命令</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>nginx <span class="token parameter variable">-s</span> stop       <span class="token comment">#快速关闭Nginx，可能不保存相关信息，并迅速终止web服务。</span>
nginx <span class="token parameter variable">-s</span> quit       <span class="token comment">#平稳关闭Nginx，保存相关信息，有安排的结束web服务。</span>
nginx <span class="token parameter variable">-s</span> reload     <span class="token comment">#因改变了Nginx相关配置，需要重新加载配置而重载。</span>
nginx <span class="token parameter variable">-s</span> reopen     <span class="token comment">#重新打开日志文件。</span>
nginx <span class="token parameter variable">-c</span> filename   <span class="token comment">#为 Nginx 指定一个配置文件，来代替缺省的。</span>
nginx <span class="token parameter variable">-t</span>            <span class="token comment">#不运行，仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件。</span>
nginx <span class="token parameter variable">-v</span>            <span class="token comment">#显示 nginx 的版本。</span>
nginx <span class="token parameter variable">-V</span>            <span class="token comment">#显示 nginx 的版本，编译器版本和配置参数。</span>
<span class="token function">ps</span> aux<span class="token operator">|</span><span class="token function">grep</span> nginx   <span class="token comment">#查看nginx进程</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="http反向代理" tabindex="-1"><a class="header-anchor" href="#http反向代理" aria-hidden="true">#</a> Http反向代理</h2><p>什么是反向代理？</p><p>反向代理（Reverse Proxy）方式是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。 <img src="`+a+`" alt="反向代理"><code>nginx.conf</code>配置文件如下： :::tips <code>conf/nginx.conf</code>是nginx的默认配置文件。也可以使用nginx -c 指定配置文件 :::</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>#运行用户
#user somebody;

#启动进程,通常设置成和cpu的数量相等
worker_processes  1;

#全局错误日志 windows配置目录
error_log  D:/Tools/nginx-1.10.1/logs/error.log;
error_log  D:/Tools/nginx-1.10.1/logs/notice.log  notice;
error_log  D:/Tools/nginx-1.10.1/logs/info.log  info;

#PID文件，记录当前启动的nginx的进程ID
pid        D:/Tools/nginx-1.10.1/logs/nginx.pid;

#工作模式及连接数上限
events {
    worker_connections 1024;    #单个后台worker process进程的最大并发链接数
}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
    #设定mime类型(邮件支持类型),类型由mime.types文件定义
    include       D:/Tools/nginx-1.10.1/conf/mime.types;
    default_type  application/octet-stream;

    #设定日志
	log_format  main  &#39;[$remote_addr] - [$remote_user] [$time_local] &quot;$request&quot; &#39;
                      &#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;
                      &#39;&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot;&#39;;

    access_log    D:/Tools/nginx-1.10.1/logs/access.log main;
    rewrite_log     on;

    #sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，对于普通应用，
    #必须设为 on,如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile        on;
    #tcp_nopush     on;

    #连接超时时间
    keepalive_timeout  120;
    tcp_nodelay        on;

	#gzip压缩开关
	#gzip  on;

    #设定实际的服务器列表
    upstream zp_server1{
        server 127.0.0.1:8089;
    }

    #HTTP服务器
    server {
        #监听80端口，80端口是知名端口号，用于HTTP协议
        listen       80;

        #定义使用www.xx.com访问 无域名时改成ip地址
        server_name  www.helloworld.com;

		#首页
		index index.html

		#指向webapp的目录
		root D:\\01_Workspace\\Project\\github\\zp\\SpringNotes\\spring-security\\spring-shiro\\src\\main\\webapp;

		#编码格式
		charset utf-8;

		#代理配置参数
        proxy_connect_timeout 180;
        proxy_send_timeout 180;
        proxy_read_timeout 180;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarder-For $remote_addr;

        #反向代理的路径（和upstream绑定），location 后面设置映射的路径
        location / {
            proxy_pass http://zp_server1;
        }

        #静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {
            root D:\\01_Workspace\\Project\\github\\zp\\SpringNotes\\spring-security\\spring-shiro\\src\\main\\webapp\\views;
            #过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
            expires 30d;
        }

        #设定查看Nginx状态的地址
        location /NginxStatus {
            stub_status           on;
            access_log            on;
            auth_basic            &quot;NginxStatus&quot;;
            auth_basic_user_file  conf/htpasswd;
        }

        #禁止访问 .htxxx 文件
        location ~ /\\.ht {
            deny all;
        }

		#错误处理页面（可选择性配置）
		#error_page   404              /404.html;
		#error_page   500 502 503 504  /50x.html;
        #location = /50x.html {
        #    root   html;
        #}
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="https反向代理" tabindex="-1"><a class="header-anchor" href="#https反向代理" aria-hidden="true">#</a> Https反向代理</h2><p>一些安全性要求比较高的站点，可能会使用HTTPS（一种使用ssl通信标准的安全HTTP协议） 这里不科普 HTTP 协议和 SSL 标准。但是，使用 nginx 配置 https 需要知道几点：</p><ul><li>HTTPS 的固定端口号是 443，不同于 HTTP 的 80 端口</li><li>SSL 标准需要引入安全证书，所以在 nginx.conf 中你需要指定证书和它对应的 key</li></ul><p>其他和 http 反向代理基本一样，只是在 Server 部分配置有些不同。</p><div class="language-conf line-numbers-mode" data-ext="conf"><pre class="language-conf"><code>#HTTPS服务器
  server {
      #监听443端口。443为知名端口号，主要用于HTTPS协议
      listen       443 ssl;

      #定义使用www.xx.com访问
      server_name  www.helloworld.com;

      #ssl证书文件位置(常见证书文件格式为：crt/pem)
      ssl_certificate      cert.pem;
      #ssl证书key位置
      ssl_certificate_key  cert.key;

      #ssl配置参数（选择性配置）
      ssl_session_cache    shared:SSL:1m;
      ssl_session_timeout  5m;
      #数字签名，此处使用MD5
      ssl_ciphers  HIGH:!aNULL:!MD5;
      ssl_prefer_server_ciphers  on;

      location / {
          root   /root;
          index  index.html index.htm;
      }
  }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20),r=[d];function c(v,t){return e(),i("div",null,r)}const m=n(l,[["render",c],["__file","ngnix.html.vue"]]);export{m as default};
