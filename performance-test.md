# 性能テスト用ドキュメント

このドキュメントは、md2pdfの性能テストを行うために、多種類の図表を大量に含んでいます。

## Mermaid図表（10個）

### 1. フローチャート
```mermaid
flowchart TD
    A[開始] --> B{条件判定}
    B -->|Yes| C[処理A]
    B -->|No| D[処理B]
    C --> E[結果処理]
    D --> E
    E --> F[終了]
```

### 2. シーケンス図
```mermaid
sequenceDiagram
    participant U as ユーザー
    participant A as アプリケーション
    participant D as データベース
    
    U->>A: ログイン要求
    A->>D: 認証情報確認
    D->>A: 認証結果
    A->>U: ログイン完了
```

### 3. ガントチャート
```mermaid
gantt
    title 開発プロジェクト
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    section 設計
    要件定義    :a1, 2024-01-01, 5d
    基本設計    :a2, after a1, 7d
    section 開発
    実装        :b1, after a2, 14d
    テスト      :b2, after b1, 7d
```

### 4. クラス図
```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
        +move()
    }
    class Dog {
        +String breed
        +bark()
        +fetch()
    }
    class Cat {
        +String color
        +meow()
        +climb()
    }
    Animal <|-- Dog
    Animal <|-- Cat
```

### 5. ER図
```mermaid
erDiagram
    CUSTOMER {
        int customer_id PK
        string name
        string email
        date created_at
    }
    ORDER {
        int order_id PK
        int customer_id FK
        date order_date
        decimal total_amount
    }
    PRODUCT {
        int product_id PK
        string product_name
        decimal price
        int stock_quantity
    }
    ORDER_ITEM {
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
    
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
```

### 6. ステート図
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : start
    Processing --> Success : complete
    Processing --> Error : fail
    Success --> [*]
    Error --> Retry : retry
    Retry --> Processing
    Error --> [*] : abort
```

### 7. パイチャート
```mermaid
pie title プログラミング言語使用率
    "JavaScript" : 30
    "Python" : 25
    "Java" : 20
    "TypeScript" : 15
    "その他" : 10
```

### 8. ジャーニーマップ
```mermaid
journey
    title オンラインショッピング体験
    section 商品検索
      商品を探す      : 5: Customer
      フィルタ適用    : 3: Customer
      結果確認        : 4: Customer
    section 購入
      カートに追加    : 5: Customer
      決済情報入力    : 2: Customer
      注文確定        : 4: Customer
    section 配送
      発送通知        : 5: Customer, System
      商品受取        : 5: Customer
```

### 9. GitGraph
```mermaid
gitgraph
    commit id: "初期コミット"
    branch feature
    checkout feature
    commit id: "機能追加"
    commit id: "バグ修正"
    checkout main
    commit id: "hotfix"
    merge feature
    commit id: "リリース"
```

### 10. マインドマップ
```mermaid
mindmap
  root((プロジェクト管理))
    企画
      要件定義
      仕様書作成
      スケジュール
    開発
      設計
      実装
      テスト
    運用
      デプロイ
      監視
      保守
```

## PlantUML図表（10個）

### 1. ユースケース図
```plantuml
@startuml
actor ユーザー as user
actor 管理者 as admin

rectangle システム {
  usecase "ログイン" as login
  usecase "商品検索" as search
  usecase "商品購入" as purchase
  usecase "在庫管理" as inventory
  usecase "売上分析" as analysis
}

user --> login
user --> search
user --> purchase
admin --> inventory
admin --> analysis
admin --> login
@enduml
```

### 2. アクティビティ図
```plantuml
@startuml
start
:ユーザー登録要求;
if (入力データ検証) then (OK)
  :データベース保存;
  if (保存成功?) then (Yes)
    :確認メール送信;
    :登録完了通知;
  else (No)
    :エラーメッセージ表示;
  endif
else (NG)
  :入力エラー表示;
endif
stop
@enduml
```

### 3. コンポーネント図
```plantuml
@startuml
package "Webアプリケーション" {
  [フロントエンド] as frontend
  [APIゲートウェイ] as gateway
  [認証サービス] as auth
  [ビジネスロジック] as business
  [データアクセス] as data
}

database "データベース" as db

frontend --> gateway
gateway --> auth
gateway --> business
business --> data
data --> db
@enduml
```

### 4. デプロイメント図
```plantuml
@startuml
node "Webサーバー" {
  [Nginx]
  [アプリケーション]
}

node "データベースサーバー" {
  [PostgreSQL]
}

node "キャッシュサーバー" {
  [Redis]
}

cloud "CDN" {
  [CloudFlare]
}

[Nginx] --> [アプリケーション]
[アプリケーション] --> [PostgreSQL]
[アプリケーション] --> [Redis]
[CloudFlare] --> [Nginx]
@enduml
```

### 5. シーケンス図（詳細版）
```plantuml
@startuml
participant "ユーザー" as user
participant "ブラウザ" as browser
participant "Webサーバー" as web
participant "アプリサーバー" as app
participant "データベース" as db

user -> browser: URL入力
browser -> web: HTTP Request
web -> app: API Call
app -> db: SQL Query
db -> app: Result Set
app -> web: JSON Response
web -> browser: HTML + CSS + JS
browser -> user: 画面表示

note right of user: ユーザーが結果を確認
@enduml
```

### 6. クラス図（詳細版）
```plantuml
@startuml
abstract class Shape {
  #String color
  #Point position
  +abstract double getArea()
  +void setPosition(Point p)
}

class Rectangle extends Shape {
  -double width
  -double height
  +double getArea()
  +void setDimensions(double w, double h)
}

class Circle extends Shape {
  -double radius
  +double getArea()
  +void setRadius(double r)
}

class Point {
  +double x
  +double y
  +Point(double x, double y)
}

Shape o-- Point
@enduml
```

### 7. オブジェクト図
```plantuml
@startuml
object "注文:Order" as order {
  order_id = 12345
  order_date = "2024-01-15"
  total_amount = 15800
}

object "顧客:Customer" as customer {
  customer_id = 456
  name = "田中太郎"
  email = "tanaka@example.com"
}

object "商品A:Product" as productA {
  product_id = 101
  name = "ノートPC"
  price = 12800
}

object "商品B:Product" as productB {
  product_id = 102
  name = "マウス"
  price = 3000
}

order --> customer
order --> productA
order --> productB
@enduml
```

### 8. パッケージ図
```plantuml
@startuml
package "プレゼンテーション層" {
  class UserController
  class ProductController
}

package "ビジネス層" {
  class UserService
  class ProductService
  class OrderService
}

package "データアクセス層" {
  class UserRepository
  class ProductRepository
  class OrderRepository
}

package "ドメイン層" {
  class User
  class Product
  class Order
}

UserController --> UserService
ProductController --> ProductService
UserService --> UserRepository
ProductService --> ProductRepository
OrderService --> OrderRepository
UserRepository --> User
ProductRepository --> Product
OrderRepository --> Order
@enduml
```

### 9. ネットワーク図
```plantuml
@startuml
cloud "インターネット" as internet
node "CDN" as cdn
node "ロードバランサー" as lb
node "Webサーバー1" as web1
node "Webサーバー2" as web2
node "アプリサーバー1" as app1
node "アプリサーバー2" as app2
database "マスターDB" as master_db
database "スレーブDB" as slave_db

internet --> cdn
cdn --> lb
lb --> web1
lb --> web2
web1 --> app1
web2 --> app2
app1 --> master_db
app2 --> master_db
master_db --> slave_db
@enduml
```

### 10. タイミング図
```plantuml
@startuml
robust "ユーザー操作" as user
robust "システム状態" as system
robust "データベース" as db

@0
user is アイドル
system is 待機中
db is 待機中

@100
user is ログイン要求
system is 認証処理中

@150
db is 認証情報確認中

@200
db is 待機中
system is セッション作成中

@250
system is ログイン完了
user is 操作可能

@300
user is 商品検索
system is 検索処理中

@350
db is 検索実行中

@400
db is 待機中
system is 結果表示
user is 結果確認中
@enduml
```

---

このドキュメントは性能テスト用に作成されており、合計20個の図表（Mermaid 10個、PlantUML 10個）を含んでいます。