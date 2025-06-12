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
@startsalt
{＋
  電卓ワイヤーフレーム
  ==
  { "                    0 " }
  --
  {
    [C ] | [± ] | [% ] | [÷ ]
    [7 ] | [8 ] | [9 ] | [× ]
    [4 ] | [5 ] | [6 ] | [− ]
    [1 ] | [2 ] | [3 ] | [＋]
    [0 ] | [. ] | [＝]
  }
}
@endsalt
```

### ガントチャートのサンプル

#### Mermaidのガントチャート

```mermaid
gantt
    title プロジェクトスケジュール
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    section 設計フェーズ
    要件定義           :a1, 2024-01-01, 10d
    基本設計           :a2, after a1, 15d
    詳細設計           :a3, after a2, 20d
    section 開発フェーズ
    実装               :b1, after a3, 30d
    単体テスト         :b2, after b1, 10d
    結合テスト         :b3, after b2, 15d
    section リリース
    システムテスト     :c1, after b3, 10d
    本番リリース準備   :c2, after c1, 5d
    本番リリース       :milestone, after c2, 0d
```

#### PlantUMLのガントチャート

```plantuml
@startgantt
project starts 2024-01-01
saturday are closed
sunday are closed

-- 設計フェーズ --
[要件定義] lasts 1 weeks
[基本設計] lasts 1 weeks
[基本設計] starts at [要件定義]'s end
[詳細設計] lasts 2 weeks
[詳細設計] starts at [基本設計]'s end

-- 開発フェーズ --
[実装] lasts 3 weeks
[実装] starts at [詳細設計]'s end
[単体テスト] lasts 1 weeks
[単体テスト] starts at [実装]'s end
[結合テスト] lasts 1 weeks
[結合テスト] starts at [単体テスト]'s end

-- リリース --
[システムテスト] lasts 1 weeks
[システムテスト] starts at [結合テスト]'s end
[本番リリース準備] lasts 3 days
[本番リリース準備] starts at [システムテスト]'s end

[本番リリース] happens at [本番リリース準備]'s end
@endgantt
```

---

これで基本的なMarkdown→PDF変換のテストが完了します。
