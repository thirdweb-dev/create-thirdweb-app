import os
import json
frameworks = os.listdir("examples")

examples = {}
for framework in frameworks:
    module_list = {}
    modules = os.listdir("examples/" + framework)
    for module in modules:
        apps = os.listdir("examples/" + framework + "/" + module)
        app_list = {}
        for app in apps:
            with open("examples/" + framework + "/" + module + "/" + app + "/thirdweb.json", "r") as thirdweb:
                metadata = json.loads(thirdweb.read())
                metadata["subfolder"] = "examples/" + framework + "/" + module + "/" + app
                app_list[app] = metadata
        module_list[module] = app_list
    examples[framework] = module_list

with open("lib/examples.json", "w") as write_file:
    json.dump(examples, write_file, indent=4)
