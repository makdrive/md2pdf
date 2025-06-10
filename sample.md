# md2pdf サンプルドキュメント

このドキュメントは、md2pdfツールの動作確認用のサンプルです。

## 基本的なMarkdown要素

### テキスト装飾

**太字**と*斜体*、そして`インラインコード`のテストです。

### リスト

- 項目1
- 項目2
  - サブ項目1
  - サブ項目2

1. 番号付きリスト1
2. 番号付きリスト2

### コードブロック

```javascript
function hello() {
    console.log("Hello, World!");
}
```

### 引用

> これは引用文のサンプルです。
> 複数行にわたる引用も対応しています。

### 表

| 項目 | 値  | 説明        |
| ---- | --- | ----------- |
| A    | 100 | サンプル値A |
| B    | 200 | サンプル値B |
| C    | 300 | サンプル値C |

## 図表のテスト

現在の基本バージョンでは、MermaidとPlantUMLの図表は後の実装で対応予定です。

### 今後対応予定の図表

```mermaid
graph LR
    A[開始] --> B{条件}
    B -->|Yes| C[処理1]
    B -->|No| D[処理2]
    C --> E[終了]
    D --> E
```

```plantuml
@startuml
actor User
participant System
User -> System: リクエスト
System -> System: 処理
System -> User: レスポンス
@enduml
```

```plantuml
@startuml
title 電卓ワイヤーフレーム

rectangle "電卓" {
    rectangle "ディスプレイ" as display
    rectangle "ボタンパネル" {
        rectangle "数字ボタン" {
            rectangle "0"
            rectangle "1"
            rectangle "2"
            rectangle "3"
            rectangle "4"
            rectangle "5"
            rectangle "6"
            rectangle "7"
            rectangle "8"
            rectangle "9"
        }
        rectangle "演算子ボタン" {
            rectangle "+"
            rectangle "-"
            rectangle "*"
            rectangle "/"
        }
        rectangle "機能ボタン" {
            rectangle "C" as clear
            rectangle "=" as equals
        }
    }
}

display -down-> ボタンパネル
ボタンパネル -down-> clear
ボタンパネル -down-> equals

@enduml
```

---

これで基本的なMarkdown→PDF変換のテストが完了します。
