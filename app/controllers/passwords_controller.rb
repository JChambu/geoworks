class PasswordsController < Devise::PasswordsController
  include ApplicationHelper
  layout 'login'
end
