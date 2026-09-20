export const TOOL_REPORTS = {
  'phone-lookup': {
    title: 'Phone Intelligence Report',
    icon: 'Phone',
    sections: [
      {
        label: 'Contact Details',
        icon: 'User',
        fields: [
          { key: 'phone_number', label: 'Primary Mobile Number' },
          { key: 'alternate_numbers', label: 'Alternate Numbers' },
          { key: 'operator', label: 'Telecom Operator' },
          { key: 'circle', label: 'Telecom Circle' },
          { key: 'sim_type', label: 'SIM Type' },
          { key: 'activity_status', label: 'Activity Status' },
        ]
      },
      {
        label: 'Subscriber Details',
        icon: 'FileText',
        fields: [
          { key: 'name', label: 'Subscriber Name' },
          { key: 'address', label: 'Registered Address', multiline: true },
          { key: 'id_proof', label: 'ID Proof Submitted' },
        ]
      },
      {
        label: 'Digital Presence',
        icon: 'Globe',
        fields: [
          { key: 'whatsapp', label: 'WhatsApp Status' },
          { key: 'truecaller_name', label: 'Truecaller Name' },
          { key: 'last_seen', label: 'Last Seen' },
        ]
      },
      {
        label: 'Assessment',
        icon: 'Brain',
        fields: [
          { key: 'summary', label: 'Summary', multiline: true },
          { key: 'observations', label: 'Key Observations', multiline: true },
        ]
      }
    ]
  },

  'vehicle-info': {
    title: 'Vehicle Intelligence Report',
    icon: 'Car',
    sections: [
      {
        label: 'Registration Details',
        icon: 'ClipboardList',
        fields: [
          { key: 'rc_number', label: 'Registration Number' },
          { key: 'rto_code', label: 'RTO Code' },
          { key: 'state_code', label: 'State Code' },
          { key: 'registration_date', label: 'Registration Date' },
          { key: 'registration_authority', label: 'Registration Authority' },
        ]
      },
      {
        label: 'Vehicle Specifications',
        icon: 'Settings',
        fields: [
          { key: 'manufacturer', label: 'Manufacturer' },
          { key: 'model', label: 'Model' },
          { key: 'vehicle_type', label: 'Vehicle Type' },
          { key: 'fuel_type', label: 'Fuel Type' },
          { key: 'engine_capacity', label: 'Engine Capacity (CC)' },
          { key: 'color', label: 'Color' },
        ]
      },
      {
        label: 'Identification Details',
        icon: 'Hash',
        fields: [
          { key: 'chassis_number', label: 'Chassis Number' },
          { key: 'engine_number', label: 'Engine Number' },
        ]
      },
      {
        label: 'Insurance Details',
        icon: 'Shield',
        fields: [
          { key: 'insurance_company', label: 'Insurance Company' },
          { key: 'policy_number', label: 'Policy Number' },
          { key: 'insurance_expiry', label: 'Insurance Expiry' },
        ]
      },
      {
        label: 'Owner Details',
        icon: 'User',
        fields: [
          { key: 'owner_name', label: 'Owner Name' },
          { key: 'owner_mobile', label: 'Owner Mobile' },
          { key: 'present_address', label: 'Present Address', multiline: true },
          { key: 'permanent_address', label: 'Permanent Address', multiline: true },
        ]
      }
    ]
  },

  'rc-verify': {
    title: 'RC Verification Report',
    icon: 'Car',
    sections: [
      {
        label: 'RC Details',
        icon: 'ClipboardList',
        fields: [
          { key: 'rc_number', label: 'RC Number' },
          { key: 'registration_date', label: 'Registration Date' },
          { key: 'rto', label: 'RTO Authority' },
          { key: 'rc_status', label: 'RC Status' },
          { key: 'fitness_upto', label: 'Fitness Valid Upto' },
        ]
      },
      {
        label: 'Vehicle Info',
        icon: 'Settings',
        fields: [
          { key: 'manufacturer', label: 'Manufacturer' },
          { key: 'model', label: 'Model' },
          { key: 'vehicle_type', label: 'Vehicle Type' },
          { key: 'fuel_type', label: 'Fuel Type' },
          { key: 'color', label: 'Color' },
          { key: 'chassis_number', label: 'Chassis Number' },
          { key: 'engine_number', label: 'Engine Number' },
        ]
      },
      {
        label: 'Owner Details',
        icon: 'User',
        fields: [
          { key: 'owner_name', label: 'Owner Name' },
          { key: 'address', label: 'Registered Address', multiline: true },
        ]
      }
    ]
  },

  'vehicle-challan': {
    title: 'Vehicle Challan Report',
    icon: 'AlertTriangle',
    sections: [
      {
        label: 'Vehicle Details',
        icon: 'Car',
        fields: [
          { key: 'vehicle_number', label: 'Vehicle Number' },
          { key: 'owner_name', label: 'Owner Name' },
        ]
      },
      {
        label: 'Challan Details',
        icon: 'FileText',
        fields: [
          { key: 'challan_number', label: 'Challan Number' },
          { key: 'challan_date', label: 'Challan Date' },
          { key: 'violation', label: 'Violation Type' },
          { key: 'fine_amount', label: 'Fine Amount (Rs.)' },
          { key: 'status', label: 'Payment Status' },
          { key: 'issued_by', label: 'Issued By' },
          { key: 'location', label: 'Location' },
        ]
      }
    ]
  },

  'aadhaar-info': {
    title: 'Aadhaar Intelligence Report',
    icon: 'CreditCard',
    sections: [
      {
        label: 'Aadhaar Details',
        icon: 'FileText',
        fields: [
          { key: 'aadhaar_number', label: 'Aadhaar Number' },
          { key: 'name', label: 'Full Name' },
          { key: 'dob', label: 'Date of Birth' },
          { key: 'gender', label: 'Gender' },
          { key: 'mobile', label: 'Linked Mobile' },
        ]
      },
      {
        label: 'Address Details',
        icon: 'MapPin',
        fields: [
          { key: 'address', label: 'Registered Address', multiline: true },
          { key: 'district', label: 'District' },
          { key: 'state', label: 'State' },
          { key: 'pincode', label: 'PIN Code' },
        ]
      },
      {
        label: 'Linkage Status',
        icon: 'Link',
        fields: [
          { key: 'pan_linked', label: 'PAN Linked' },
          { key: 'bank_linked', label: 'Bank Account Linked' },
          { key: 'mobile_linked', label: 'Mobile Linked' },
        ]
      }
    ]
  },

  'pan-lookup': {
    title: 'PAN Intelligence Report',
    icon: 'CreditCard',
    sections: [
      {
        label: 'PAN Card Details',
        icon: 'FileText',
        fields: [
          { key: 'pan_number', label: 'PAN Number' },
          { key: 'name', label: 'Full Name' },
          { key: 'dob', label: 'Date of Birth' },
          { key: 'father_name', label: 'Father Name' },
          { key: 'status', label: 'PAN Status' },
          { key: 'pan_type', label: 'PAN Type' },
        ]
      },
      {
        label: 'Tax Details',
        icon: 'BarChart2',
        fields: [
          { key: 'assessment_year', label: 'Assessment Year' },
          { key: 'filing_status', label: 'ITR Filing Status' },
          { key: 'aadhaar_linked', label: 'Aadhaar Linked' },
        ]
      }
    ]
  },

  'upi-lookup': {
    title: 'UPI Intelligence Report',
    icon: 'CreditCard',
    sections: [
      {
        label: 'UPI Details',
        icon: 'Smartphone',
        fields: [
          { key: 'upi_id', label: 'UPI ID' },
          { key: 'name', label: 'Account Holder Name' },
          { key: 'bank', label: 'Bank Name' },
          { key: 'account_type', label: 'Account Type' },
          { key: 'ifsc', label: 'IFSC Code' },
          { key: 'branch', label: 'Branch' },
          { key: 'account_number', label: 'Account Number' },
        ]
      },
      {
        label: 'Transaction Support',
        icon: 'ArrowLeftRight',
        fields: [
          { key: 'imps', label: 'IMPS' },
          { key: 'neft', label: 'NEFT' },
          { key: 'rtgs', label: 'RTGS' },
          { key: 'upi_status', label: 'UPI Status' },
        ]
      }
    ]
  },

  'bank-verify': {
    title: 'Bank Account Verification Report',
    icon: 'Building',
    sections: [
      {
        label: 'Account Details',
        icon: 'ClipboardList',
        fields: [
          { key: 'account_number', label: 'Account Number' },
          { key: 'account_holder', label: 'Account Holder Name' },
          { key: 'bank_name', label: 'Bank Name' },
          { key: 'account_type', label: 'Account Type' },
          { key: 'ifsc', label: 'IFSC Code' },
          { key: 'branch', label: 'Branch Name' },
          { key: 'branch_address', label: 'Branch Address', multiline: true },
          { key: 'micr', label: 'MICR Code' },
          { key: 'status', label: 'Account Status' },
        ]
      }
    ]
  },

  'ifsc-details': {
    title: 'Bank IFSC Report',
    icon: 'Building',
    sections: [
      {
        label: 'Bank Details',
        icon: 'Building',
        fields: [
          { key: 'ifsc', label: 'IFSC Code' },
          { key: 'bank_name', label: 'Bank Name' },
          { key: 'branch', label: 'Branch Name' },
          { key: 'address', label: 'Branch Address', multiline: true },
          { key: 'city', label: 'City' },
          { key: 'district', label: 'District' },
          { key: 'state', label: 'State' },
          { key: 'contact', label: 'Contact Number' },
          { key: 'micr', label: 'MICR Code' },
          { key: 'rtgs', label: 'RTGS Enabled' },
          { key: 'neft', label: 'NEFT Enabled' },
          { key: 'imps', label: 'IMPS Enabled' },
        ]
      }
    ]
  },

  'gst-verify': {
    title: 'GST Verification Report',
    icon: 'Building2',
    sections: [
      {
        label: 'GST Details',
        icon: 'FileText',
        fields: [
          { key: 'gstin', label: 'GSTIN' },
          { key: 'business_name', label: 'Business Name' },
          { key: 'trade_name', label: 'Trade Name' },
          { key: 'business_type', label: 'Business Type' },
          { key: 'registration_date', label: 'Registration Date' },
          { key: 'status', label: 'GST Status' },
          { key: 'pan', label: 'Linked PAN' },
        ]
      },
      {
        label: 'Address Details',
        icon: 'MapPin',
        fields: [
          { key: 'principal_address', label: 'Principal Address', multiline: true },
          { key: 'state', label: 'State' },
        ]
      },
      {
        label: 'Filing Details',
        icon: 'BarChart2',
        fields: [
          { key: 'last_return', label: 'Last Return Filed' },
          { key: 'return_type', label: 'Return Type' },
          { key: 'filing_status', label: 'Filing Status' },
        ]
      }
    ]
  },

  'mca-company': {
    title: 'MCA Company Intelligence Report',
    icon: 'Building2',
    sections: [
      {
        label: 'Company Details',
        icon: 'Building2',
        fields: [
          { key: 'company_name', label: 'Company Name' },
          { key: 'cin', label: 'CIN' },
          { key: 'company_type', label: 'Company Type' },
          { key: 'category', label: 'Category' },
          { key: 'sub_category', label: 'Sub Category' },
          { key: 'incorporation_date', label: 'Incorporation Date' },
          { key: 'status', label: 'Company Status' },
          { key: 'roc', label: 'ROC' },
        ]
      },
      {
        label: 'Financial Details',
        icon: 'BarChart2',
        fields: [
          { key: 'paid_up_capital', label: 'Paid Up Capital' },
          { key: 'authorized_capital', label: 'Authorized Capital' },
          { key: 'last_agm', label: 'Last AGM Date' },
          { key: 'last_balance_sheet', label: 'Last Balance Sheet' },
        ]
      },
      {
        label: 'Registered Address',
        icon: 'MapPin',
        fields: [
          { key: 'address', label: 'Registered Address', multiline: true },
          { key: 'state', label: 'State' },
          { key: 'email', label: 'Email' },
        ]
      }
    ]
  },

  'ip-intelligence': {
    title: 'IP Intelligence Report',
    icon: 'Wifi',
    sections: [
      {
        label: 'IP Details',
        icon: 'Monitor',
        fields: [
          { key: 'ip_address', label: 'IP Address' },
          { key: 'ip_version', label: 'IP Version' },
          { key: 'type', label: 'IP Type' },
          { key: 'isp', label: 'ISP' },
          { key: 'org', label: 'Organization' },
          { key: 'asn', label: 'ASN' },
        ]
      },
      {
        label: 'Location Details',
        icon: 'MapPin',
        fields: [
          { key: 'city', label: 'City' },
          { key: 'region', label: 'Region/State' },
          { key: 'country', label: 'Country' },
          { key: 'latitude', label: 'Latitude' },
          { key: 'longitude', label: 'Longitude' },
          { key: 'timezone', label: 'Timezone' },
        ]
      },
      {
        label: 'Risk Assessment',
        icon: 'AlertTriangle',
        fields: [
          { key: 'risk_score', label: 'Risk Score' },
          { key: 'proxy', label: 'Proxy/VPN Detected' },
          { key: 'tor', label: 'TOR Detected' },
          { key: 'threat_type', label: 'Threat Type' },
        ]
      }
    ]
  },

  'email-forensics': {
    title: 'Email Forensics Report',
    icon: 'Mail',
    sections: [
      {
        label: 'Email Details',
        icon: 'Mail',
        fields: [
          { key: 'email', label: 'Email Address' },
          { key: 'provider', label: 'Email Provider' },
          { key: 'domain', label: 'Domain' },
          { key: 'created', label: 'Account Created' },
          { key: 'status', label: 'Account Status' },
        ]
      },
      {
        label: 'Breach Information',
        icon: 'Unlock',
        fields: [
          { key: 'breach_count', label: 'Number of Breaches' },
          { key: 'breach_names', label: 'Breach Sources' },
          { key: 'breach_date', label: 'Latest Breach Date' },
          { key: 'data_exposed', label: 'Data Exposed' },
        ]
      },
      {
        label: 'Header Analysis',
        icon: 'Search',
        fields: [
          { key: 'sender_ip', label: 'Sender IP' },
          { key: 'mail_server', label: 'Mail Server' },
          { key: 'spf', label: 'SPF Status' },
          { key: 'dkim', label: 'DKIM Status' },
          { key: 'dmarc', label: 'DMARC Status' },
        ]
      }
    ]
  },

  'cdr-analysis': {
    title: 'CDR Analysis Report',
    icon: 'Phone',
    sections: [
      {
        label: 'Subject Details',
        icon: 'User',
        fields: [
          { key: 'phone_number', label: 'Target Number' },
          { key: 'operator', label: 'Operator' },
          { key: 'period', label: 'Analysis Period' },
        ]
      },
      {
        label: 'Call Statistics',
        icon: 'BarChart2',
        fields: [
          { key: 'total_calls', label: 'Total Calls' },
          { key: 'incoming_calls', label: 'Incoming Calls' },
          { key: 'outgoing_calls', label: 'Outgoing Calls' },
          { key: 'total_duration', label: 'Total Duration' },
          { key: 'unique_contacts', label: 'Unique Contacts' },
          { key: 'top_contact', label: 'Most Called Number' },
        ]
      },
      {
        label: 'Location Intelligence',
        icon: 'MapPin',
        fields: [
          { key: 'towers_used', label: 'Cell Towers Used' },
          { key: 'frequent_location', label: 'Frequent Location' },
          { key: 'night_location', label: 'Night Location (Home)' },
          { key: 'day_location', label: 'Day Location (Work)' },
        ]
      },
      {
        label: 'Assessment',
        icon: 'Activity',
        fields: [
          { key: 'summary', label: 'Summary', multiline: true },
          { key: 'suspicious_activity', label: 'Suspicious Activity', multiline: true },
        ]
      }
    ]
  },

  'voter-id': {
    title: 'Voter ID Verification Report',
    icon: 'Shield',
    sections: [
      {
        label: 'Voter Details',
        icon: 'User',
        fields: [
          { key: 'voter_id', label: 'Voter ID Number' },
          { key: 'name', label: 'Full Name' },
          { key: 'dob', label: 'Date of Birth' },
          { key: 'age', label: 'Age' },
          { key: 'gender', label: 'Gender' },
          { key: 'father_name', label: 'Father / Husband Name' },
        ]
      },
      {
        label: 'Constituency Details',
        icon: 'Building2',
        fields: [
          { key: 'state', label: 'State' },
          { key: 'district', label: 'District' },
          { key: 'assembly', label: 'Assembly Constituency' },
          { key: 'polling_station', label: 'Polling Station' },
          { key: 'serial_number', label: 'Serial Number' },
          { key: 'part_number', label: 'Part Number' },
        ]
      },
      {
        label: 'Address',
        icon: 'MapPin',
        fields: [
          { key: 'address', label: 'Registered Address', multiline: true },
        ]
      }
    ]
  },

  'passport-verify': {
    title: 'Passport Verification Report',
    icon: 'FileText',
    sections: [
      {
        label: 'Passport Details',
        icon: 'FileText',
        fields: [
          { key: 'passport_number', label: 'Passport Number' },
          { key: 'name', label: 'Full Name' },
          { key: 'dob', label: 'Date of Birth' },
          { key: 'gender', label: 'Gender' },
          { key: 'nationality', label: 'Nationality' },
          { key: 'place_of_birth', label: 'Place of Birth' },
          { key: 'issue_date', label: 'Issue Date' },
          { key: 'expiry_date', label: 'Expiry Date' },
          { key: 'issue_place', label: 'Place of Issue' },
          { key: 'type', label: 'Passport Type' },
        ]
      },
      {
        label: 'Status',
        icon: 'CheckCircle',
        fields: [
          { key: 'status', label: 'Passport Status' },
          { key: 'ecr_status', label: 'ECR/ECNR Status' },
        ]
      }
    ]
  },

  'dl-verify': {
    title: 'Driving License Verification Report',
    icon: 'Car',
    sections: [
      {
        label: 'DL Details',
        icon: 'ClipboardList',
        fields: [
          { key: 'dl_number', label: 'DL Number' },
          { key: 'name', label: 'Full Name' },
          { key: 'dob', label: 'Date of Birth' },
          { key: 'gender', label: 'Gender' },
          { key: 'issue_date', label: 'Issue Date' },
          { key: 'expiry_date', label: 'Expiry Date' },
          { key: 'issuing_rto', label: 'Issuing RTO' },
          { key: 'dl_status', label: 'DL Status' },
        ]
      },
      {
        label: 'Vehicle Classes',
        icon: 'Car',
        fields: [
          { key: 'vehicle_classes', label: 'Authorized Vehicle Classes' },
          { key: 'hazmat', label: 'Hazmat Authorized' },
        ]
      },
      {
        label: 'Address',
        icon: 'MapPin',
        fields: [
          { key: 'address', label: 'Registered Address', multiline: true },
        ]
      }
    ]
  },

  'electricity-bill': {
    title: 'Electricity Bill Report',
    icon: 'Zap',
    sections: [
      {
        label: 'Consumer Details',
        icon: 'User',
        fields: [
          { key: 'consumer_number', label: 'Consumer Number' },
          { key: 'name', label: 'Consumer Name' },
          { key: 'address', label: 'Service Address', multiline: true },
          { key: 'discom', label: 'Electricity Provider' },
          { key: 'meter_number', label: 'Meter Number' },
          { key: 'connection_type', label: 'Connection Type' },
        ]
      },
      {
        label: 'Bill Details',
        icon: 'FileText',
        fields: [
          { key: 'bill_amount', label: 'Bill Amount (Rs.)' },
          { key: 'due_date', label: 'Due Date' },
          { key: 'bill_date', label: 'Bill Date' },
          { key: 'units_consumed', label: 'Units Consumed' },
          { key: 'payment_status', label: 'Payment Status' },
        ]
      }
    ]
  },

  'domain-analysis': {
    title: 'Domain Analysis Report',
    icon: 'Globe',
    sections: [
      {
        label: 'Domain Details',
        icon: 'Globe',
        fields: [
          { key: 'domain', label: 'Domain Name' },
          { key: 'registrar', label: 'Registrar' },
          { key: 'created', label: 'Created Date' },
          { key: 'updated', label: 'Updated Date' },
          { key: 'expiry', label: 'Expiry Date' },
          { key: 'status', label: 'Domain Status' },
          { key: 'dnssec', label: 'DNSSEC' },
        ]
      },
      {
        label: 'Registrant Details',
        icon: 'User',
        fields: [
          { key: 'registrant_name', label: 'Registrant Name' },
          { key: 'registrant_org', label: 'Registrant Organization' },
          { key: 'registrant_email', label: 'Registrant Email' },
          { key: 'registrant_country', label: 'Registrant Country' },
        ]
      },
      {
        label: 'DNS Records',
        icon: 'Server',
        fields: [
          { key: 'nameservers', label: 'Name Servers' },
          { key: 'a_record', label: 'A Record (IP)' },
          { key: 'mx_record', label: 'MX Record' },
          { key: 'txt_record', label: 'TXT Record' },
        ]
      }
    ]
  },

  'breach-database': {
    title: 'Data Breach Report',
    icon: 'Database',
    sections: [
      {
        label: 'Target Details',
        icon: 'User',
        fields: [
          { key: 'query', label: 'Query (Email/Phone/Username)' },
          { key: 'found_in', label: 'Found In Databases' },
        ]
      },
      {
        label: 'Breach Details',
        icon: 'AlertTriangle',
        fields: [
          { key: 'total_breaches', label: 'Total Breaches Found' },
          { key: 'breach_sources', label: 'Breach Sources', multiline: true },
          { key: 'first_breach', label: 'First Breach Date' },
          { key: 'latest_breach', label: 'Latest Breach Date' },
        ]
      },
      {
        label: 'Exposed Data',
        icon: 'Unlock',
        fields: [
          { key: 'emails', label: 'Emails Exposed' },
          { key: 'passwords', label: 'Passwords Exposed' },
          { key: 'phone_numbers', label: 'Phone Numbers Exposed' },
          { key: 'financial_data', label: 'Financial Data Exposed' },
          { key: 'personal_data', label: 'Personal Data Exposed', multiline: true },
        ]
      }
    ]
  },

  'social-profiler': {
    title: 'Social Media Intelligence Report',
    icon: 'Users',
    sections: [
      {
        label: 'Subject Details',
        icon: 'User',
        fields: [
          { key: 'name', label: 'Name / Username' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone Number' },
        ]
      },
      {
        label: 'Platform Presence',
        icon: 'Smartphone',
        fields: [
          { key: 'facebook', label: 'Facebook Profile' },
          { key: 'instagram', label: 'Instagram Handle' },
          { key: 'twitter', label: 'Twitter/X Handle' },
          { key: 'linkedin', label: 'LinkedIn Profile' },
          { key: 'youtube', label: 'YouTube Channel' },
          { key: 'telegram', label: 'Telegram' },
        ]
      },
      {
        label: 'Digital Footprint',
        icon: 'Globe',
        fields: [
          { key: 'google_account', label: 'Google Account Status' },
          { key: 'amazon', label: 'Amazon Account' },
          { key: 'last_active', label: 'Last Active' },
          { key: 'location_tags', label: 'Location Tags', multiline: true },
          { key: 'observations', label: 'Key Observations', multiline: true },
        ]
      }
    ]
  },

  'fastag-info': {
    title: 'FasTag Information Report',
    icon: 'CreditCard',
    sections: [
      {
        label: 'FasTag Details',
        icon: 'CreditCard',
        fields: [
          { key: 'tag_id', label: 'Tag ID' },
          { key: 'vehicle_number', label: 'Vehicle Number' },
          { key: 'vehicle_class', label: 'Vehicle Class' },
          { key: 'bank', label: 'Issuing Bank' },
          { key: 'status', label: 'Tag Status' },
          { key: 'wallet_balance', label: 'Wallet Balance (Rs.)' },
        ]
      },
      {
        label: 'Owner Details',
        icon: 'User',
        fields: [
          { key: 'owner_name', label: 'Owner Name' },
          { key: 'mobile', label: 'Linked Mobile' },
          { key: 'email', label: 'Linked Email' },
        ]
      }
    ]
  },

  'insurance-info': {
    title: 'Insurance Information Report',
    icon: 'Shield',
    sections: [
      {
        label: 'Policy Details',
        icon: 'ClipboardList',
        fields: [
          { key: 'policy_number', label: 'Policy Number' },
          { key: 'policy_type', label: 'Policy Type' },
          { key: 'insurer', label: 'Insurance Company' },
          { key: 'start_date', label: 'Start Date' },
          { key: 'expiry_date', label: 'Expiry Date' },
          { key: 'premium', label: 'Annual Premium (Rs.)' },
          { key: 'sum_assured', label: 'Sum Assured (Rs.)' },
          { key: 'status', label: 'Policy Status' },
        ]
      },
      {
        label: 'Policyholder Details',
        icon: 'User',
        fields: [
          { key: 'holder_name', label: 'Policyholder Name' },
          { key: 'dob', label: 'Date of Birth' },
          { key: 'mobile', label: 'Mobile Number' },
          { key: 'nominee', label: 'Nominee Name' },
        ]
      }
    ]
  },
}

export const DEFAULT_REPORT = {
  title: 'Intelligence Report',
  icon: 'FileText',
  sections: [
    {
      label: 'Query Details',
      icon: 'Search',
      fields: [
        { key: 'query_input', label: 'Query Input' },
        { key: 'result_summary', label: 'Result Summary', multiline: true },
        { key: 'data_found', label: 'Data Found', multiline: true },
      ]
    },
    {
      label: 'Assessment',
      icon: 'Activity',
      fields: [
        { key: 'observations', label: 'Key Observations', multiline: true },
        { key: 'recommendations', label: 'Recommendations', multiline: true },
      ]
    }
  ]
}

export const getToolReport = (toolId) => {
  return TOOL_REPORTS[toolId] || DEFAULT_REPORT
}