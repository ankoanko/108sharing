module Uploadable
  extend ActiveSupport::Concern
  # rubocop:disable all
  class_methods do
    def uploadable_field(field, opts = {})
      include Rails.application.routes.url_helpers

      has_one_attached field

      define_method "#{field}_url" do
        image = public_send(field)
        if image.attached?
          begin
            rails_representation_url(
              image.variant(strip: true).processed,
              only_path: true,
              )
          rescue MiniMagick::Error => e
          end
        else
          public_send("default_#{field}_path")
        end
      end

      define_method "#{field}_attached" do
        image = public_send(field)
        image.attached?
      end

      define_method "#{field}_attach" do |image_io|
        image = public_send(field)
        image.
          attach(
            io: image_io,
            filename: "image.#{image_io.content_type.split("/").second}",
            content_type: image_io.content_type,
            )
      end

      if versions = opts[:versions]
        versions.each do |version, flag|
          define_method "#{version}_#{field}_url" do
            image = public_send(field)
            return unless image.attached?

            rails_representation_url(
              image.variant(strip: true, resize: flag).processed,
              only_path: true,
              )
            # Example
            # image.variant(combine_options: { gravity: 'center',
            #  thumbnail: '60x60>',
            #  extent: '300x200>',
            #  background: 'white'
            # }).processed
          end
        end
      end
    end
  end
end
