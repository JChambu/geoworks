class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

  #  if user.is? "SuperAdmin"
  #    can :manage, :all
  #  end

    if user.is? "Admin"
      can :manage, :all
    end
   
    if user.is? "Moderator"
      can :manage, :all
    end
    
    
    if user.is? "User"
      #Poi
      can :manage, Poi
      can :visualize, :duplicated
      can :visualize, :possible_duplicates
      can :search, :pois
      can :manage, Parking
      #Poi sub types
      can :visualize, :poi_type_sub_types
      can :visualize, :poi_type_chains
      can :visualize, :poi_type_food_types
      can :edit, User do |u|
        u.id == user.id
      end
      can :update, User do |u|
        u.id == user.id
      end
      #Administation
    end

    




    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user 
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. 
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/ryanb/cancan/wiki/Defining-Abilities
  end
end
