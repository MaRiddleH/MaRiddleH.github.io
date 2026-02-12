# 2026年AI学习笔记

玩ai时遇到的问题

## 1. mineru+qwen实现pdf转化成markdown并翻译

### 1.1 trae自动运行终端无法操作conda环境的问题

```
 帮我用python写一个代码，读取一个pdf文件，参考{{{}}}中的代码将pdf转化成markdown格式文件，使用.env中的url和token，同时生成一个require文件，让我可以pip安装所有依赖并运行
 {{{
 import requests

token = "官网申请的api token"
url = "https://mineru.net/api/v4/extract/task"
header = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}
data = {
    "url": "本地pdf文件路径",
    "model_version": "vlm"
}

res = requests.post(url,headers=header,json=data)
print(res.status_code)
print(res.json())
print(res.json()["data"])
}}}
```

