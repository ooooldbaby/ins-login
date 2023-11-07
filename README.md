
2023-11-07

运行在以下环境

node版本v16.20.0

python3.8

execjs的安装是为 pip install PyExecJS==1.5.1  # 需要注意， 包的名称：PyExecJS  

结果为:

<RequestsCookieJar[<Cookie csrftoken=po31kjm2QQFX9JUHSxSVwd4gGyt9RZ2d for .instagram.com/>, <Cookie ds_user_id=62724365584 for .instagram.com/>, <Cookie ig_did=14C82F93-4160-4FE8-BE3E-ECFFE1899B84 for .instagram.com/>, <Cookie mid=ZUmw0QALAAFUmAN3bSfLzD0QeFuS for .instagram.com/>, <Cookie rur="NAO\05462724365584\0541730864211:01f736e7eb48ce94f03e9237dd11df968880b68f7f46432163802c8ebc15d24ecbb2d1b6" for .instagram.com/>, <Cookie sessionid=xxxx%3ANPy3v9KcLq5dNN%3A29%3AAYdckc_ej4la4pJ0Ir34bIEPCxpQomlk5nnkAt0JPA for .instagram.com/>]>

拿上 csrftoken 、 sessionid 可直接使用
登录后建议使用 session 保持会话

恰巧可以绕过 谷歌验证码