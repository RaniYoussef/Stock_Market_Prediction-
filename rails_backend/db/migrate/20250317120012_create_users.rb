class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :role, default: "user"
      t.decimal :balance, precision: 10, scale: 2

      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
