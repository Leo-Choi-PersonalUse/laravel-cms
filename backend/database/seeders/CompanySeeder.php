<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companyTypes = ['Corporation', 'Inc', 'Ltd', 'LLC', 'Group', 'Industries', 'Solutions', 'Technologies', 'Systems', 'Enterprises'];
        $companyNames = [
            'Tech', 'Global', 'Digital', 'Advanced', 'Premier', 'Elite', 'Dynamic', 'Innovative',
            'Smart', 'Future', 'Alpha', 'Beta', 'Quantum', 'Nexus', 'Vertex', 'Summit',
            'Phoenix', 'Titan', 'Omega', 'Delta', 'Sigma', 'Zenith', 'Apex', 'Prime',
            'Core', 'Edge', 'Wave', 'Spark', 'Nova', 'Stellar', 'Cosmic', 'Horizon',
            'Vision', 'Unity', 'Synergy', 'Matrix', 'Vector', 'Catalyst', 'Pinnacle', 'Vanguard'
        ];
        
        $businessSectors = [
            'Manufacturing', 'Logistics', 'Consulting', 'Software', 'Hardware',
            'Marketing', 'Financial', 'Healthcare', 'Education', 'Retail',
            'Construction', 'Energy', 'Telecom', 'Automotive', 'Aerospace'
        ];

        $cities = [
            'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
            'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
            'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte',
            'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston'
        ];

        $streets = [
            'Main Street', 'Oak Avenue', 'Park Road', 'Maple Drive', 'Cedar Lane',
            'Elm Street', 'Washington Avenue', 'Lake View Drive', 'Hill Road', 'Forest Avenue',
            'River Street', 'Sunset Boulevard', 'Highland Avenue', 'Valley Road', 'Mountain Drive'
        ];

        for ($i = 1; $i <= 200; $i++) {
            $name = $companyNames[array_rand($companyNames)];
            $sector = $businessSectors[array_rand($businessSectors)];
            $type = $companyTypes[array_rand($companyTypes)];
            
            $companyName = "$name $sector $type";
            $code = strtoupper(substr($name, 0, 3) . substr($sector, 0, 2) . str_pad($i, 3, '0', STR_PAD_LEFT));
            
            $streetNumber = rand(100, 9999);
            $street = $streets[array_rand($streets)];
            $city = $cities[array_rand($cities)];
            $zipCode = str_pad(rand(10000, 99999), 5, '0', STR_PAD_LEFT);
            
            $address = "$streetNumber $street, $city, " . ['CA', 'NY', 'TX', 'FL', 'IL'][array_rand(['CA', 'NY', 'TX', 'FL', 'IL'])] . " $zipCode";
            
            $areaCode = rand(200, 999);
            $phone = "($areaCode) " . rand(200, 999) . "-" . str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
            
            $emailDomain = strtolower(str_replace(' ', '', $name . $sector)) . '.com';
            $email = 'info@' . $emailDomain;
            
            Company::create([
                'name' => $companyName,
                'code' => $code,
                'address' => $address,
                'phone' => $phone,
                'email' => $email,
                'is_active' => rand(0, 100) > 10, // 90% active
            ]);
        }

        $this->command->info('Successfully created 200 companies!');
    }
}
