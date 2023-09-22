from setuptools import setup, find_packages

setup(
    name='oeel',
    version='0.9.8.4',
    author='Mathieu Gravey',
    author_email='research@mgravey.com',
    url='https://www.open-geocomputing.org/OpenEarthEngineLibrary/',
    description='The Open Earth Engine Library Python interface',
    long_description='Python interface for the OpenEarthEngineLibrary and JS Earth Engine code.',
    classifiers=['Development Status :: 3 - Alpha','License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)','Programming Language :: Python :: 3','Programming Language :: JavaScript','Topic :: Scientific/Engineering :: GIS'],
    packages=['oeel'],
    license='GPLv3',
    license_files = ('LICENSE',),
    include_package_data=False,
    package_data={'oeel': ['EE_node_server.js']},
    install_requires=[
        'earthengine-api',
        'pyzmq'
    ],
    keywords = ['Earth Engine', 'OEEL', 'Open Earth Engine Library']
)