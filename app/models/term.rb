class Term < ActiveRecord::Base
	scope :by_names, lambda {|terms| where(:name => terms)}
end
