# frozen_string_literal: true

load_paths = Dir['/opt/ruby/2.7.0/gems/**/lib']
$LOAD_PATH.unshift(*load_paths)

require 'csv'
require 'erb'
require 'fileutils'
require 'zip'
require 'base64'

class ZipFileGenerator
  # Initialize with the directory to zip and the location of the output archive.
  def initialize(input_dir, output_file)
    @input_dir = input_dir
    @output_file = output_file
  end

  # Zip the input directory.
  def write
    entries = Dir.entries(@input_dir) - %w[. ..]
    ::Zip::File.open(@output_file, ::Zip::File::CREATE) do |zipfile|
      write_entries entries, '', zipfile
    end
  end

  private

  # A helper method to make the recursion work.
  def write_entries(entries, path, zipfile)
    entries.each do |e|
      zipfile_path = path == '' ? e : File.join(path, e)
      disk_file_path = File.join(@input_dir, zipfile_path)

      if File.directory? disk_file_path
        recursively_deflate_directory(disk_file_path, zipfile, zipfile_path)
      else
        put_into_archive(disk_file_path, zipfile, zipfile_path)
      end
    end
  end

  def recursively_deflate_directory(disk_file_path, zipfile, zipfile_path)
    zipfile.mkdir zipfile_path
    subdir = Dir.entries(disk_file_path) - %w[. ..]
    write_entries subdir, zipfile_path, zipfile
  end

  def put_into_archive(disk_file_path, zipfile, zipfile_path)
    zipfile.add(zipfile_path, disk_file_path)
  end
end

# @param [String] application The name of the application
# @param [String] environment The environment. E.g. Production, Staging, Test
# @param [Integer] timeout Timeout in seconds
# @param [Integer] schedule Schedule in seconds
def render(application:, endpoints:, environment:, schedule:, service:, renderer:, team:, timeout:, tags:)
  renderer.result_with_hash(
    team: team,
    application: application,
    environment: environment,
    service: service,
    endpoints: endpoints,
    tags: tags,
    schedule: schedule,
    timeout: timeout
  )
end

def process_csv_data(table)
  http_erb_filename = 'sample.http.yml.erb'
  http_check_erb_renderer = ERB.new(File.read(http_erb_filename))

  tcp_erb_filename = 'sample.tcp.yml.erb'
  tcp_check_erb_renderer = ERB.new(File.read(tcp_erb_filename))
  tcp_rows = 0
  http_rows = 0
  table.each do |row|
    type = row[0]
    team = row[1]
    application = row[2]
    environment = row [3]
    service = row[4]
    endpoints = row[5]
    tags = row[6] == nil ? '' : row[6]
    schedule = row[7]
    timeout = row[8]

    if type.eql? 'http'
      renderer = http_check_erb_renderer
      http_rows += 1
    elsif type.eql? 'tcp'
      renderer = tcp_check_erb_renderer
      tcp_rows += 1
    else
      puts 'Skipped row: ' + row.to_csv
      next
    end
    result = render(application: application, endpoints: endpoints, environment: environment, schedule: schedule, service: service, renderer: renderer, team: team, timeout: timeout, tags:tags)

    output_directory = '/tmp/monitors/'
    FileUtils.mkdir_p output_directory
    File.write(output_directory + team + '-' + application + '-' + environment + '-' + service + '.yml', result)
  end
  puts 'Processed ' + http_rows.to_s + ' http and ' + tcp_rows.to_s + " tcp lines."
end

def write_zip_file
  output_directory = '/tmp/monitors/'
  FileUtils.mkdir_p output_directory
  output_file = '/tmp/out.zip'
  File.delete(output_file) if File.exist?(output_file)
  zf = ZipFileGenerator.new(output_directory, output_file)
  zf.write
end

def local_execution(input_file)
  content = File.read(input_file)
  process(content)
  debug_info
  data = open('/tmp/out.zip', 'rb').read
  encoded = Base64.strict_encode64(data)
  {'isBase64Encoded': true, 'statusCode': 200, body: encoded, headers: {'content-type': 'application/zip'}}
end

def process(text)
  table = CSV.parse(text, headers: true, col_sep: ';', row_sep: :auto)
  process_csv_data(table)
  write_zip_file
end

def debug_info
  tmp_dir_content = `ls -lah /tmp/out.zip`
  puts tmp_dir_content

  tmp_monitors_dir_content = `ls -lah /tmp/monitors`
  puts tmp_monitors_dir_content
end

def handler(event:, context:)
  if event['body'].nil?
    text = 'Missing request body'
    return {'isBase64Encoded': false, 'statusCode': 400, body: text, headers: {'content-type': 'application/json'}}
  end
  process(event['body'])
  debug_info
  data = open('/tmp/out.zip', 'rb').read
  encoded = Base64.strict_encode64(data)
  {'isBase64Encoded': true, 'statusCode': 200, body: encoded, headers: {'content-type': 'application/zip', 'content-encoding': 'base64'}}
end

#local_execution("../data.csv")