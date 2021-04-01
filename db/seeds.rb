ActiveRecord::Base.transaction do

  if User.where(email: ENV['USER_EMAIL']).empty?
    @user =  User.create!(
      name: ENV['USER_NAME'],
      email:  ENV['USER_EMAIL'],
      password:  ENV['USER_PASSWORD'],
      active: true,
      confirmed_at: '2019-10-28 20:21:41.312046',
    )
  end

  @role = Role.where(name: 'superadmin').first_or_create!

  @customer = Customer.where(name: 'public').where(subdomain: 'public').where(url: 'http://public.api.geoworks.com.ar/api/v1').first_or_create!

  if !@user.nil? and !@customer.nil? and !@role.nil?
    UserCustomer.where(user_id: @user.id).where(customer_id: @customer.id).where(role_id: @role.id).first_or_create!
  end

  AnalysisType.where(name: 'count' ).first_or_create!
  AnalysisType.where(name: 'sum' ).first_or_create!
  AnalysisType.where(name: 'min' ).first_or_create!
  AnalysisType.where(name: 'max' ).first_or_create!
  AnalysisType.where(name: 'avg' ).first_or_create!

  Chart.where(name: 'point' ).first_or_create!
  Chart.where(name: 'area' ).first_or_create!
  Chart.where(name: 'line' ).first_or_create!
  Chart.where(name: 'doughnut' ).first_or_create!
  Chart.where(name: 'bubble' ).first_or_create!
  Chart.where(name: 'horizontalBar' ).first_or_create!
  Chart.where(name: 'bar' ).first_or_create!

  Event.where(name: 'new' ).first_or_create!
  Event.where(name: 'edit').first_or_create!
  Event.where(name: 'edit_subforms').first_or_create!
  Event.where(name: 'edit_geom').first_or_create!
  Event.where(name: 'edit_owner').first_or_create!
  Event.where(name: 'destroy').first_or_create!
  Event.where(name: 'visualizer').first_or_create!
  Event.where(name: 'share').first_or_create!
  Event.where(name: 'export').first_or_create!
  Event.where(name: 'disable').first_or_create!

  FieldType.where(name: 'Texto' ).first_or_create!
  FieldType.where(name: 'Listado (opción única)' ).first_or_create!
  FieldType.where(name: 'Fecha' ).first_or_create!
  FieldType.where(name: 'Boleano' ).first_or_create!
  FieldType.where(name: 'Numérico' ).first_or_create!
  FieldType.where(name: 'Sub-formulario' ).first_or_create!
  FieldType.where(name: 'Listado (opción multiple)' ).first_or_create!
  FieldType.where(name: 'Subtítulo' ).first_or_create!

  ModelType.where(name: 'project_types').first_or_create!
  ModelType.where(name: 'indicators').first_or_create!
  ModelType.where(name: 'reports').first_or_create!
  ModelType.where(name: 'data').first_or_create!
  ModelType.where(name: 'attributes').first_or_create!
  ModelType.where(name: 'layers').first_or_create!
  ModelType.where(name: 'choice_lists').first_or_create!
  ModelType.where(name: 'statuses').first_or_create!
  ModelType.where(name: 'graphics').first_or_create!
end
