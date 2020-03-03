ActiveRecord::Base.transaction do

  if User.where(email: ENV['email']).empty?
    @user =  User.create!(
      name: ENV['username'],
      email: ENV['email'],
      password: ENV['user_password'],
      active: true,
      confirmed_at: '2019-10-28 20:21:41.312046',
      token: SecureRandom.base64(64),
      authentication_token: SecureRandom.base64(20),
    )
  end

  @role = Role.where(name: 'superadmin').first_or_create!

 @customer = Customer.where(name: 'public').where(subdomain: 'public').first_or_create!
  if !@user.nil? and !@customer.nil? and !@role.nil?
    UserCustomer.where(user_id: @user.id).where(customer_id: @customer.id).where(role_id: @role.id).first_or_create!
  end

  AnalysisType.where(name: 'countq' ).first_or_create!
  AnalysisType.where(name: 'sumq' ).first_or_create!
  AnalysisType.where(name: 'minq' ).first_or_create!
  AnalysisType.where(name: 'maxq' ).first_or_create!
  AnalysisType.where(name: 'avgq' ).first_or_create!

  Chart.where(name: 'point' ).first_or_create!
  Chart.where(name: 'area' ).first_or_create!
  Chart.where(name: 'line' ).first_or_create!
  Chart.where(name: 'doughnut' ).first_or_create!
  Chart.where(name: 'bubble' ).first_or_create!
  Chart.where(name: 'horizontalBar' ).first_or_create!
  Chart.where(name: 'bar' ).first_or_create!

  Event.where(name: 'new' ).first_or_create!
  Event.where(name: 'edit').first_or_create!
  Event.where(name: 'destroy').first_or_create!
  Event.where(name: 'visualizer').first_or_create!
  Event.where(name: 'share').first_or_create!
  Event.where(name: 'export').first_or_create!

  FieldType.where(name: 'Texto' ).first_or_create!
  FieldType.where(name: 'Listado (opción única)' ).first_or_create!
  FieldType.where(name: 'Fecha' ).first_or_create!
  FieldType.where(name: 'Boleano' ).first_or_create!
  FieldType.where(name: 'Numerico' ).first_or_create!
  FieldType.where(name: 'Sub-formulario' ).first_or_create!
  FieldType.where(name: 'Listado (opción multiple)' ).first_or_create!
  FieldType.where(name: 'Sub Titulo' ).first_or_create!

  ModelType.where(name: 'project_types').first_or_create!
  ModelType.where(name: 'indicators').first_or_create!
  ModelType.where(name: 'reports').first_or_create!
  ModelType.where(name: 'data').first_or_create!
  ModelType.where(name: 'attributes').first_or_create!
  ModelType.where(name: 'layers').first_or_create!
  ModelType.where(name: 'choice_lists').first_or_create!
end
