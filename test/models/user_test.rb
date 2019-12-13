require 'test_helper'

class UserTest < ActiveSupport::TestCase
   test "save_user_1" do
     user = User.new
     assert user.save, "Saved the user "
   end

  test "assert_raises(NameError)" do
      assert_raises(NameError) do
      some_undefined_variable
  end
  end

end
