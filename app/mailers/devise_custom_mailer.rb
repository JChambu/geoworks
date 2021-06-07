class DeviseCustomMailer < Devise::Mailer
  helper :application # gives access to all helpers defined within `application_helper`.
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'devise/mailer' # to make sure that your mailer uses the devise views

  before_action :add_inline_attachment!, :confirmation_instructions!

  def add_inline_attachment!
    attachments.inline['logo_gw_ver_1.png'] = File.read("#{Rails.root}/app/assets/images/logo_gw_ver_1.png")
  end

  def confirmation_instructions!(record, token, opts={})
    super
  end
    #
    # puts ''
    # puts ' *************************** DEVISE CUSTOM PARAMS *************************** '
    # p @subdomain
    # puts ' *********************************************************** '
    # puts ''
    # @subdomain = Customer.find_by_sql("SELECT public.user_customers.user_id, public.user_customers.customer_id, public.users.id, public.customers.id, public.customers.subdomain
    #                                    FROM public.user_customers
    #                                    INNER JOIN public.users
    #                                    ON public.user_customers.user_id = public.users.id
    #                                    INNER JOIN public.customers
    #                                    ON public.user_customers.customer_id = public.customers.id").pluck(:subdomain).last

    # SELECT public.customers.subdomain FROM public.customers WHERE public.customers.id = 16
    # SELECT * FROM public.customers LEFT JOIN public.user_customers ON public.customers.id = user_customers.customer_id
    # SELECT * FROM public.customers INNER JOIN public.user_customers ON public.customers.id = user_customers.customer_id
    # SELECT * FROM public.user_customers INNER JOIN public.users ON public.user_customers.user_id = public.users.id



end
