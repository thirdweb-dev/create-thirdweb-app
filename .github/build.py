import os
import json
frameworks = os.listdir("examples")
examples = {}
slugs = {}


def add_slug(slug, metadata):
    if slug in slugs.keys():
        raise Exception("Duplicate slug: " + slug)
    slugs[slug] = metadata


for framework in frameworks:
    module_list = {}
    modules = os.listdir("examples/" + framework)
    for module in modules:
        apps = os.listdir("examples/" + framework + "/" + module)
        app_list = {}
        for app in apps:
            with open("examples/" + framework + "/" + module + "/" + app + "/thirdweb.json", "r") as thirdweb:
                metadata = json.loads(thirdweb.read())
                metadata["subfolder"] = "examples/" + \
                    framework + "/" + module + "/" + app
                if "default" not in metadata.keys():
                    metadata["default"] = False
                    with open("examples/" + framework + "/" + module + "/" + app + "/thirdweb.json", "w") as f:
                        f.write(json.dumps(metadata))
                if metadata["default"]:
                    app_list["default"] = metadata

                app_list[app] = metadata
        module_list[module] = app_list
    examples[framework] = module_list

with open("lib/examples.json", "w") as write_file:
    json.dump(examples, write_file, indent=4)

with open("lib/slugs.json", "w") as write_file:
    json.dump(slugs, write_file, indent=4)
